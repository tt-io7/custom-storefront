'use client'

import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import { useState } from "react"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCallback } from "react"

type ProductListTemplateProps = {
  region: HttpTypes.StoreRegion
  countryCode: string
  products: HttpTypes.StoreProduct[]
  collections: HttpTypes.StoreCollection[] | null
  categories: HttpTypes.StoreProductCategory[] | null
  total: number
  nextPage: number | null
  params: {
    sortBy?: SortOptions
    page?: string
    q?: string
  }
}

const ProductListTemplate = ({
  region,
  countryCode,
  products,
  collections,
  categories,
  total,
  nextPage,
  params,
}: ProductListTemplateProps) => {
  const [currentProducts, setCurrentProducts] = useState(products)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(!!nextPage)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // For price filter
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      if (value === null || value === '') {
        params.delete(name)
      } else {
        params.set(name, value)
      }
      return params.toString()
    },
    [searchParams]
  )

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId)
    const query = createQueryString('category', categoryId === selectedCategory ? '' : categoryId)
    router.push(`${pathname}?${query}`)
  }

  const handlePriceFilter = (option: string) => {
    const query = createQueryString('price', option)
    router.push(`${pathname}?${query}`)
  }

  const handleLoadMore = async () => {
    if (!nextPage || isLoading) return

    setIsLoading(true)

    try {
      const response = await fetch(
        `/api/${countryCode}/products?limit=12&offset=${nextPage}`
      )
      
      if (!response.ok) {
        throw new Error(`Error loading more products: ${response.statusText}`)
      }
      
      const { products: newProducts } = await response.json()
      
      setCurrentProducts((prev) => [...prev, ...newProducts])
      
      // If we got fewer than 12 products, there are no more to load
      if (newProducts.length < 12) {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error loading more products", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shop All Products</h1>
            <p className="text-gray-600 mt-1">Browse our collection of {total} products</p>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar for filters */}
          <div className="hidden lg:block lg:w-64 mr-8">
            <div className="sticky top-24">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
              
              {/* Categories Filter */}
              <div className="border-t border-gray-200 pt-4 pb-6">
                <h4 className="text-base font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <input
                          id={`category-${category.id}`}
                          name="category"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedCategory === category.id}
                          onChange={() => handleCategoryFilter(category.id)}
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))
                  ) : collections && collections.length > 0 ? (
                    collections.map((collection) => (
                      <div key={collection.id} className="flex items-center">
                        <input
                          id={`collection-${collection.id}`}
                          name="collection"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedCategory === collection.id}
                          onChange={() => handleCategoryFilter(collection.id)}
                        />
                        <label
                          htmlFor={`collection-${collection.id}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {collection.title}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No categories available</p>
                  )}
                </div>
              </div>
              
              {/* Price Filter */}
              <div className="border-t border-gray-200 pt-4 pb-6">
                <h4 className="text-base font-medium text-gray-900 mb-3">Price</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="price-low-high"
                      name="price"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      onChange={() => handlePriceFilter('asc')}
                      checked={params.sortBy === 'price_asc'}
                    />
                    <label htmlFor="price-low-high" className="ml-3 text-sm text-gray-600">
                      Price: Low → High
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="price-high-low"
                      name="price"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      onChange={() => handlePriceFilter('desc')}
                      checked={params.sortBy === 'price_desc'}
                    />
                    <label htmlFor="price-high-low" className="ml-3 text-sm text-gray-600">
                      Price: High → Low
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Products grid */}
          <div className="flex-1">
            {currentProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProducts.map((p) => (
                    <div key={p.id} className="h-full">
                      <ProductPreview product={p} region={region} />
                    </div>
                  ))}
                </div>
                
                {/* Load more button */}
                {hasMore && (
                  <div className="flex items-center justify-center mt-12">
                    <button
                      onClick={handleLoadMore}
                      className="px-6 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading More
                        </div>
                      ) : (
                        "Load More Products"
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No products found</h2>
                <p className="text-gray-600 mb-6 max-w-md text-center">
                  We couldn't find any products matching your criteria. Try adjusting your filters or search term.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductListTemplate 