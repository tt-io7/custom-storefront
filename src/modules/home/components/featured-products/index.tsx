'use client'

import { useEffect, useState } from 'react'
import { HttpTypes } from "@medusajs/types"
import { ChevronRightMini } from "@medusajs/icons"
import { motion } from "framer-motion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductCard from "@modules/products/components/ProductCard"

type FeaturedProductsProps = {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
  countryCode: string
}

// Simple product type that matches ProductCard expectations
interface SimpleProduct {
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

const FeaturedProducts = ({ products, region, countryCode }: FeaturedProductsProps) => {
  const [activeCategory, setActiveCategory] = useState("all")
  
  // Example categories - in a real app, you would derive these from your products
  const categories = [
    { id: "all", name: "All Products" },
    { id: "featured", name: "Featured" },
    { id: "new", name: "New Arrivals" },
    { id: "bestsellers", name: "Bestsellers" }
  ]
  
  // Filter products by category (simplified example)
  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.slice(0, 4) // Just for demo, in real app you'd filter by category
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }
  
  // Transform products for ProductCard compatibility
  const transformedProducts: SimpleProduct[] = filteredProducts.map(product => {
    // Get the first variant
    const firstVariant = product.variants?.[0] || null
    
    // Create a simple version with mandatory fields for ProductCard
    return {
      id: product.id,
      title: product.title || "",
      description: product.description || "",
      thumbnail: product.thumbnail || undefined,
      handle: product.handle,
      variants: [{
        id: firstVariant?.id || "default",
        title: firstVariant?.title || "Default",
        prices: [{
          // Use any available price or default to 0
          amount: firstVariant ? 
            // Access prices as an indexed property because of type limitations
            (firstVariant as any).prices?.[0]?.amount || 0 : 0,
          currency_code: firstVariant ? 
            (firstVariant as any).prices?.[0]?.currency_code || region.currency_code 
            : region.currency_code
        }]
      }]
    }
  })
  
  return (
    <section className="py-16 bg-gradient-to-b from-white to-lilac-50">
      <div className="content-container py-8 px-4 sm:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold text-primary px-4 py-1.5 bg-lilac-100 rounded-full mb-3"
          >
            Premium Collection
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Featured Products
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl text-gray-600 mb-8"
          >
            Discover our handpicked selection of premium tech products, showcasing the best in design and functionality for your digital lifestyle.
          </motion.p>
          
          {/* Category tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-lilac-50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>
        </div>
        
        {/* Product grid with animations */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {transformedProducts.map((product) => (
            <motion.div 
              key={product.id}
              variants={itemVariants}
              transition={{ duration: 0.5 }}
              className="flex"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
        
        {/* "View all" button with animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mt-12"
        >
          <LocalizedClientLink
            href={`/${countryCode}/store`}
            className="group flex items-center bg-white hover:bg-lilac-50 text-primary font-medium px-6 py-3 rounded-full shadow-sm transition-all hover:shadow-md"
          >
            <span>Explore all products</span>
            <span className="ml-2 transform transition-transform group-hover:translate-x-1">
              <ChevronRightMini />
            </span>
          </LocalizedClientLink>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedProducts
