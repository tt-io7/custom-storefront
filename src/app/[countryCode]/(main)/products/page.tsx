import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getRegion } from "@lib/data/regions"
import { listProductCategories } from "@lib/data/product-categories"
import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import ProductTemplate from "@modules/products/templates/product-list"

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    q?: string
    category?: string
    collection?: string
    price?: string
  }>
}

export const metadata: Metadata = {
  title: "Products | Medusa Store",
  description: "Browse all products in our store.",
}

export default async function ProductsPage({
  params,
  searchParams,
}: Props) {
  // First await the params and searchParams objects themselves
  const awaitedParams = await params
  const awaitedSearchParams = await searchParams
  
  // Now we can safely access their properties
  const countryCode = awaitedParams.countryCode
  const page = awaitedSearchParams.page
  const sortBy = awaitedSearchParams.sortBy
  const q = awaitedSearchParams.q
  const categoryId = awaitedSearchParams.category
  const collectionId = awaitedSearchParams.collection
  const priceOrder = awaitedSearchParams.price
  
  const region = await getRegion(countryCode)
  
  if (!region) {
    notFound()
  }
  
  // Extract pagination info from searchParams
  const pageNumber = page ? parseInt(page) : 1
  const offset = (pageNumber - 1) * 12  // Display 12 products per page
  
  // Build query parameters
  const queryParams: Record<string, any> = {
    limit: 100,  // Increase limit to get more products at once
    offset: offset,
    fields: "*"   // Use fields instead of expand
  }
  
  // Add sort options if provided
  if (sortBy) {
    switch (sortBy) {
      case "price_asc":
        queryParams.order = "variants.prices.amount:asc"
        break
      case "price_desc":
        queryParams.order = "variants.prices.amount:desc"
        break
      case "created_at":
        queryParams.order = "created_at:desc"
        break
      default:
        queryParams.order = "created_at:desc"
    }
  } else if (priceOrder) {
    // Handle price filter from sidebar
    queryParams.order = priceOrder === 'asc' 
      ? "variants.prices.amount:asc"
      : "variants.prices.amount:desc"
  }
  
  // Add category filter if provided
  if (categoryId) {
    queryParams.category_id = categoryId
  }
  
  // Add collection filter if provided
  if (collectionId) {
    queryParams.collection_id = collectionId
  }
  
  // Add search query if provided
  if (q) {
    queryParams.q = q
  }
  
  // Fetch products with pagination support
  const { response, nextPage } = await listProducts({
    countryCode,
    queryParams,
  })
  
  // Try to get product categories first (newer Medusa versions)
  let categories = null
  try {
    const result = await listProductCategories({
      countryCode,
    })
    categories = result.product_categories
  } catch (e) {
    console.log("Could not fetch product categories, falling back to collections")
  }
  
  // Fall back to collections for older Medusa versions
  let collections = null
  if (!categories || categories.length === 0) {
    try {
      const result = await listCollections({
        countryCode,
      })
      collections = result.collections
    } catch (e) {
      console.log("Could not fetch collections")
    }
  }
  
  // After the products are fetched, add this
  console.log("Product query params:", queryParams);
  console.log("Product response:", response);
  console.log("Product count:", response.count);
  console.log("Products:", response.products);
  
  return (
    <ProductTemplate
      region={region}
      countryCode={countryCode}
      products={response.products}
      collections={collections}
      categories={categories}
      total={response.count}
      nextPage={nextPage}
      params={awaitedSearchParams}
    />
  )
} 