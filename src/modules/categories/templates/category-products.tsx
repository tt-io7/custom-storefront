'use client'

import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import RefinementList from "@modules/store/components/refinement-list"
import { useState } from "react"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import LocalizedCategoryLink from "@modules/common/components/localized-category-link"

type CategoryProductsTemplateProps = {
  category: HttpTypes.StoreProductCategory
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
  countryCode: string
  total: number
  currentPage: number
  hasNextPage: boolean
  params: {
    sortBy?: string
    page?: string
  }
}

const CategoryProductsTemplate = ({
  category,
  products: initialProducts,
  region,
  countryCode,
  total,
  currentPage,
  hasNextPage: initialHasNextPage,
  params,
}: CategoryProductsTemplateProps) => {
  const [currentProducts, setCurrentProducts] = useState(initialProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialHasNextPage)
  const [page, setPage] = useState(currentPage)
  const limit = 12

  const handleLoadMore = async () => {
    if (!hasMore || isLoading) return

    setIsLoading(true)

    try {
      const nextPage = page + 1
      const response = await fetch(
        `/api/${countryCode}/categories/${category.id}?limit=${limit}&offset=${(nextPage - 1) * limit}${params.sortBy ? `&order=${params.sortBy}` : ''}`
      )
      
      if (!response.ok) {
        throw new Error(`Error loading more products: ${response.statusText}`)
      }
      
      const { products: newProducts, count } = await response.json()
      
      setCurrentProducts((prev) => [...prev, ...newProducts])
      setPage(nextPage)
      
      // Check if there are more products to load
      setHasMore(count > nextPage * limit)
    } catch (error) {
      console.error("Error loading more products", error)
    } finally {
      setIsLoading(false)
    }
  }

  const categoryBreadcrumbs = () => {
    const breadcrumbs = []
    
    // Add parent categories if they exist
    let currentCategory = category
    if (currentCategory.parent_category) {
      breadcrumbs.unshift({
        name: currentCategory.parent_category.name,
        href: `/categories/${currentCategory.parent_category.handle}`,
        handle: currentCategory.parent_category.handle
      })
    }
    
    // Add current category
    breadcrumbs.push({
      name: category.name,
      href: `/categories/${category.handle}`,
      handle: category.handle,
      current: true
    })
    
    return breadcrumbs
  }

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6">
      <RefinementList 
        sortBy={params.sortBy as SortOptions || "created_at"}
        data-testid="category-refinement"
      />
      <div className="w-full">
        <div className="flex flex-col mb-8">
          {/* Breadcrumbs */}
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <LocalizedClientLink href="/" className="text-ui-fg-subtle hover:text-ui-fg-base">
                  Home
                </LocalizedClientLink>
              </li>
              {categoryBreadcrumbs().map((breadcrumb, index) => (
                <li key={index}>
                  <div className="flex items-center">
                    <span className="mx-2 text-ui-fg-subtle">/</span>
                    {breadcrumb.current ? (
                      <span className="text-ui-fg-base font-semibold">
                        {breadcrumb.name}
                      </span>
                    ) : (
                      <LocalizedCategoryLink
                        categoryHandle={breadcrumb.handle}
                        className="text-ui-fg-subtle hover:text-ui-fg-base"
                      >
                        {breadcrumb.name}
                      </LocalizedCategoryLink>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </nav>
          
          <h1 className="text-2xl-semi mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-ui-fg-subtle mb-6">{category.description}</p>
          )}
          <div className="flex justify-between items-center">
            <span className="text-ui-fg-base">{total} products</span>
          </div>
        </div>
        
        {currentProducts.length > 0 ? (
          <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-4 gap-y-8">
            {currentProducts.map((p) => (
              <li key={p.id}>
                <ProductPreview product={p} region={region} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-large-semi text-gray-900 mb-4">No products found</h2>
            <p className="text-base-regular text-gray-700 mb-6 max-w-[32rem] text-center">
              We couldn't find any products in this category. Try checking back later or browse other categories.
            </p>
          </div>
        )}
        
        {/* Load more button */}
        {hasMore && (
          <div className="flex items-center justify-center mt-8">
            <button
              onClick={handleLoadMore}
              className="btn-ui"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-t-transparent border-ui-fg-base rounded-full animate-spin mx-4"></div>
              ) : (
                "Load more"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryProductsTemplate 