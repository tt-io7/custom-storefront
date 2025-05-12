'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '../hooks/use-cart'
import WishlistButton from './WishlistButton'
import { ProductThumbnail } from './SafeImage'
import { formatPrice } from '@/lib/utils/format-price'

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

  return (
    <Link
      href={`/products/${handle}`}
      className="group product-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
    >
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-xl bg-gray-200">
        {thumbnail && !imageError ? (
          <div className="relative h-64 w-full overflow-hidden">
            <Image
              src={thumbnail}
              alt={title}
              className="product-image object-cover object-center h-full w-full transition-transform duration-500"
              width={300}
              height={300}
              onError={() => setImageError(true)}
              priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-100">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-base font-medium text-gray-900 mt-1 mb-2 line-clamp-1">{title}</h3>
        {price !== undefined && (
          <p className="text-lg font-semibold text-primary">{formatPrice(price)}</p>
        )}
        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="inline-block bg-lilac-100 rounded-full px-3 py-1 text-xs font-medium text-primary">
            View Details
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard