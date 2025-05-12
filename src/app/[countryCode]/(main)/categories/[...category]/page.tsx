import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCategoryByHandle } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import CategoryProductsTemplate from "@modules/categories/templates/category-products"

type Props = {
  params: { countryCode: string; category: string[] }
  searchParams: {
    sortBy?: string
    page?: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = params
  const handle = category.join("/")
  
  const categoryData = await getCategoryByHandle(handle)
  
  if (!categoryData) {
    return {
      title: "Category not found | Medusa Store",
      description: "The category you're looking for doesn't exist.",
    }
  }
  
  return {
    title: `${categoryData.name} | Medusa Store`,
    description: categoryData.description || `Browse ${categoryData.name} products`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: Props) {
  const { countryCode, category } = params
  const handle = category.join("/")
  
  const region = await getRegion(countryCode)
  
  if (!region) {
    notFound()
  }
  
  const categoryData = await getCategoryByHandle(handle)
  
  if (!categoryData) {
    notFound()
  }
  
  // Extract pagination info from searchParams
  const pageNumber = searchParams.page ? parseInt(searchParams.page) : 1
  const limit = 12
  const offset = (pageNumber - 1) * limit
  
  // Build query parameters
  const queryParams: Record<string, any> = {
    limit,
    offset,
    category_id: [categoryData.id],
  }
  
  // Add sort options if provided
  if (searchParams.sortBy) {
    switch (searchParams.sortBy) {
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
  }
  
  // Fetch products with pagination support
  const { response, nextPage } = await listProducts({
    countryCode,
    queryParams,
  })
  
  return (
    <CategoryProductsTemplate
      category={categoryData}
      products={response.products}
      region={region}
      countryCode={countryCode}
      total={response.count}
      currentPage={pageNumber}
      hasNextPage={!!nextPage}
      params={searchParams}
    />
  )
}
