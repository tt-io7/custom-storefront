import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "../config"
import { getCacheOptions } from "./cookies"

/**
 * Retrieves a list of product categories from the Medusa API.
 * @param options - The options to pass to the request
 * @returns The product categories
 */
export async function listProductCategories(options: {
  countryCode: string
  limit?: number
  offset?: number
  expand?: string[]
}) {
  const next = {
    ...(await getCacheOptions("categories")),
    revalidate: 10, // Shorter revalidation time for categories
  }

  // We accept countryCode but don't pass it to the API
  const { countryCode, ...rest } = options

  try {
    // Create a clean query object using only valid parameters for Medusa API
    const query: Record<string, any> = {
      limit: options.limit || 100
    }
    
    // Include offset if provided
    if (options.offset !== undefined) {
      query.offset = options.offset;
    }
    
    // Don't include any fields or expand parameters that are causing validation errors
    
    console.log("Fetching product categories with query:", query)
    
    return sdk.client
      .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
        "/store/product-categories",
        {
          query,
          next,
          cache: "force-cache",
        }
      )
  } catch (error) {
    console.error("Error fetching product categories:", error)
    if (error instanceof Response && error.status === 404) {
      // API endpoint not found - older Medusa version without product_categories
      return { product_categories: [] }
    }
    
    if (error instanceof Error && error.message.includes("fetch failed")) {
      // Connection issue - provide a clear error message
      throw new Error(`Unable to connect to Medusa server: ${error.message}`)
    }
    
    // Return an empty array for other errors to allow fallback to collections
    return { product_categories: [] }
  }
}

/**
 * Retrieves a product category by its handle from the Medusa API.
 * @param options - The options to pass to the request
 * @returns The product category
 */
export async function getProductCategoryByHandle(options: {
  countryCode: string
  handle: string
}) {
  const next = {
    ...(await getCacheOptions("category-page")),
    revalidate: 60, // 1 minute
  }

  try {
    // We don't pass countryCode to the API - follow Medusa documentation
    const { product_category } = await sdk.client
      .fetch<{ product_category: HttpTypes.StoreProductCategory }>(
        `/store/product-categories/${options.handle}`,
        {
          next,
          cache: "force-cache",
        }
      )

    return { product_category }
  } catch (error) {
    console.error("Error fetching product category:", error)
    if (error instanceof Error && error.message.includes("fetch failed")) {
      // Connection issue - provide a clear error message
      throw new Error(`Unable to connect to Medusa server: ${error.message}`)
    }
    return notFound()
  }
} 