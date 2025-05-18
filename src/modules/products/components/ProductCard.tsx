'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaRegHeart, FaHeart, FaShoppingCart } from 'react-icons/fa'
import { formatPrice } from '../../../modules/layout/lib/utils'

// Define props for both direct values and Medusa product
export interface ProductCardProps {
  product: {
    id: string
    title: string
    description?: string
    thumbnail?: string
    handle: string
    variants: {
      id: string
      title: string
      prices: {
        amount: number
        currency_code: string
      }[]
    }[]
  }
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Return placeholder or null if product is undefined
  if (!product) {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-md p-4 flex items-center justify-center h-64">
        <span className="text-gray-400">Product not available</span>
      </div>
    );
  }

  const { title, thumbnail, handle, variants } = product
  const price = variants[0]?.prices[0]?.amount
  const [imageError, setImageError] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div 
      className="group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
        {/* Product Image Section */}
        <Link
          href={`/products/${handle}`}
          className="relative block aspect-square overflow-hidden bg-gray-100"
        >
          {thumbnail && !imageError ? (
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src={thumbnail}
                alt={title}
                className="product-image object-cover object-center h-full w-full transition-transform duration-500 group-hover:scale-110"
                width={300}
                height={300}
                onError={() => setImageError(true)}
                priority={true}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-100">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
          
          {/* Quick actions overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsWishlisted(!isWishlisted);
              }}
              className="p-2 bg-white rounded-full shadow-md hover:bg-lilac-50 transition-colors"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isWishlisted ? (
                <FaHeart className="w-4 h-4 text-primary" />
              ) : (
                <FaRegHeart className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
          
          {/* "View Product" button that appears on hover */}
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <span className="block w-full text-center bg-white hover:bg-lilac-50 text-primary font-medium py-2 rounded-full shadow-md transition-colors">
              View Product
            </span>
          </div>
        </Link>
        
        {/* Product Info Section */}
        <div className="p-4">
          <h3 className="text-base font-medium text-gray-900 mt-1 mb-2 line-clamp-1">{title}</h3>
          
          <div className="flex justify-between items-end">
            {price !== undefined && (
              <p className="text-lg font-semibold text-primary">{formatPrice(price)}</p>
            )}
            
            <Link 
              href={`/products/${handle}`}
              className="text-xs text-gray-500 hover:text-primary transition-colors"
            >
              Details →
            </Link>
          </div>
          
          {/* Buy Button */}
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              height: isHovered ? 'auto' : 0 
            }}
            transition={{ duration: 0.3 }}
            className="mt-3 overflow-hidden"
          >
            <Link
              href={`/products/${handle}`}
              className="flex items-center justify-center w-full gap-2 bg-lilac-100 hover:bg-lilac-200 text-primary font-medium py-2 rounded-md transition-colors"
            >
              <FaShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard