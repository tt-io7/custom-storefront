'use client'

import { HttpTypes } from "@medusajs/types"
import Link from "next/link"
import React, { useState } from "react"
import { HeartIcon, EyeIcon, ShoppingBagIcon } from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid"
import Thumbnail from "./thumbnail/index"

type ProductPreviewProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

const ProductPreview = ({ product, region }: ProductPreviewProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  
  const { handle, thumbnail, title, variants } = product

  const getPrice = () => {
    if (!variants || variants.length === 0) {
      return {
        calculated_price: "N/A",
      }
    }

    const variant = variants[0]
    
    if (!variant.prices || variant.prices.length === 0) {
      return {
        calculated_price: "N/A",
      }
    }

    const price = variant.prices.find(
      (p) => p.currency_code === region.currency_code
    )

    if (!price) {
      return {
        calculated_price: "N/A",
      }
    }

    // Format price based on region
    const amount = price.amount || 0
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: region.currency_code,
    })

    return {
      calculated_price: formatter.format(amount / 100),
    }
  }

  const price = getPrice()

  return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 ease-in-out group-hover:shadow-lg">
        <Link href={`/products/${handle}`} className="block">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Thumbnail thumbnail={thumbnail} size="full" />
            
            {/* Overlay with actions that appears on hover */}
            <div className={`absolute inset-0 bg-black/5 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowQuickView(true);
                  }}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Quick view"
                >
                  <EyeIcon className="w-5 h-5 text-gray-700" />
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsWishlisted(!isWishlisted);
                  }}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-gray-700" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="text-base font-medium text-gray-900 truncate mb-1">
              {title}
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-gray-900">
                {price.calculated_price}
              </p>
              <button 
                className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Add to cart logic would go here
                  console.log("Add to cart: ", product.id);
                }}
                aria-label="Add to cart"
              >
                <ShoppingBagIcon className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowQuickView(false)}>
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">{title}</h2>
              <button onClick={() => setShowQuickView(false)} className="text-gray-500 hover:text-gray-700">
                <span className="sr-only">Close</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-square w-full relative">
                <Thumbnail thumbnail={thumbnail} size="full" />
              </div>
              
              <div>
                <p className="text-xl font-bold mb-4">{price.calculated_price}</p>
                <p className="text-gray-600 mb-6">
                  {product.description?.substring(0, 200) || "No description available"}
                  {product.description && product.description.length > 200 ? "..." : ""}
                </p>
                
                <div className="flex gap-4">
                  <Link 
                    href={`/products/${handle}`}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    View Details
                  </Link>
                  <button 
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => {
                      // Add to cart logic would go here
                      console.log("Add to cart from modal: ", product.id);
                      setShowQuickView(false);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductPreview 