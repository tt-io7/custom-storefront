"use client"

import { HttpTypes } from "@medusajs/types"
import LocalizedCategoryLink from "@modules/common/components/localized-category-link"
import Thumbnail from "@modules/products/components/thumbnail"
import clsx from "clsx"

export default function FeaturedCategories({
  categories,
}: {
  categories: HttpTypes.StoreProductCategory[]
}) {
  if (!categories || categories.length === 0) {
    return null
  }

  // Only show up to 3 categories
  const displayCategories = categories.slice(0, 3)

  return (
    <div className="py-12">
      <div className="content-container py-12">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-base-regular text-gray-600 mb-6">
            Categories
          </span>
          <h3 className="text-2xl-regular text-gray-900 max-w-lg mb-4">
            Shop by Category
          </h3>
          <p className="text-base-regular text-gray-500 max-w-lg">
            Browse our collections and find products that match your style and needs.
          </p>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCategories.map((category, index) => (
            <li key={category.id} className="relative group">
              <LocalizedCategoryLink
                categoryHandle={category.handle}
                className="block h-full"
              >
                <div className={clsx(
                  "group rounded-md overflow-hidden h-full bg-gray-100 relative",
                  {"aspect-square": index === 0, "aspect-[16/9]": index > 0}
                )}>
                  {category.metadata?.thumbnail ? (
                    <Thumbnail
                      thumbnail={category.metadata.thumbnail as string}
                      size="full"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center p-5 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200">
                    <div className="bg-white bg-opacity-90 py-3 px-6 text-black text-center rounded">
                      <h4 className="text-xl-semi">{category.name}</h4>
                      {category.description && (
                        <p className="text-small-regular mt-1 text-gray-700">{category.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </LocalizedCategoryLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 