"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export const listCategories = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children, *products, *parent_category, *parent_category.parent_category",
          limit,
          ...query,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories)
}

/**
 * Get a product category by handle
 */
export const getCategoryByHandle = async (
  handle: string,
  countryCode?: string
): Promise<HttpTypes.StoreProductCategory | null> => {
  try {
    const headers = {
      ...(await getAuthHeaders()),
    }

    const next = {
      ...(await getCacheOptions("categories")),
      revalidate: 60, // revalidate every minute
    }

    const { product_categories } = await sdk.client.fetch<{
      product_categories: HttpTypes.StoreProductCategory[]
    }>(
      `/store/product-categories`,
      {
        method: "GET",
        query: {
          handle,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )

    if (!product_categories.length) {
      return null
    }

    return product_categories[0]
  } catch (error) {
    console.error("Error getting category by handle:", error)
    return null
  }
}

/**
 * Get a product category by ID
 */
export const getCategoryById = async (
  id: string,
  countryCode?: string
): Promise<HttpTypes.StoreProductCategory | null> => {
  try {
    const headers = {
      ...(await getAuthHeaders()),
    }

    const next = {
      ...(await getCacheOptions("categories")),
      revalidate: 60, // revalidate every minute
    }

    const { product_category } = await sdk.client.fetch<{
      product_category: HttpTypes.StoreProductCategory
    }>(
      `/store/product-categories/${id}`,
      {
        method: "GET",
        headers,
        next,
        cache: "force-cache",
      }
    )

    return product_category
  } catch (error) {
    console.error("Error getting category by ID:", error)
    return null
  }
}

/**
 * Get category products with pagination
 */
export const getCategoryProducts = async ({
  categoryId,
  pageParam = 1,
  countryCode,
  queryParams = {}
}: {
  categoryId: string
  pageParam?: number
  countryCode?: string
  queryParams?: Record<string, any>
}) => {
  const limit = queryParams.limit || 12
  const offset = ((pageParam || 1) - 1) * limit

  const headers = {
    ...(await getAuthHeaders()),
  }

  // Directly fetch products through the API with proper category filtering
  const { products, count } = await sdk.client.fetch<{ 
    products: any[], 
    count: number 
  }>(
    "/store/products",
    {
      method: "GET",
      query: {
        category_id: [categoryId],
        limit,
        offset,
        ...queryParams
      },
      headers,
      next: { revalidate: 30 },
    }
  )

  console.log(`Found ${count} products for category ${categoryId}`)

  return {
    response: {
      products,
      count
    },
    nextPage: count > (pageParam * limit) ? pageParam + 1 : null
  }
}
