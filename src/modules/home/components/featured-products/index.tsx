'use client'

import { useEffect, useState } from 'react'
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import { ChevronRightMini } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type FeaturedProductsProps = {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
  countryCode: string
}

const FeaturedProducts = ({ products, region, countryCode }: FeaturedProductsProps) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="py-12">
      <div className="content-container py-12">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-base font-semibold text-indigo-600 mb-2">
            Demo Showcase
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="max-w-lg text-gray-600">
            Discover our handpicked selection of premium tech products, showcasing the best in design and functionality.
          </p>
        </div>
        
        <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-4 gap-y-8">
          {products.map((product, index) => (
            <li 
              key={product.id}
              className={`transition-all duration-700 transform ${
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <ProductPreview 
                product={product} 
                region={region} 
                isFeatured={true} 
              />
            </li>
          ))}
        </ul>
        
        <div className="flex items-center justify-center mt-8">
          <LocalizedClientLink
            href={`/${countryCode}/store`}
            className="flex items-center text-lg text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
          >
            View all products
            <ChevronRightMini className="ml-2" />
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default FeaturedProducts
