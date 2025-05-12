'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import medusaApi from '../lib/medusa'
import { formatPrice } from '../lib/utils'

interface SearchResult {
  id: string
  title: string
  description: string
  handle: string
  thumbnail?: string
  price: number
  currency_code: string
}

export default function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [country, setCountry] = useState('us') // Default country
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  
  // Get country from pathname
  useEffect(() => {
    if (pathname) {
      const match = pathname.match(/^\/([^\/]+)/)
      if (match && match[1] !== '[country]') {
        setCountry(match[1])
      }
    }
  }, [pathname])
  
  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  // Search products when query changes
  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setResults([])
        return
      }
      
      setLoading(true)
      
      try {
        // In a real implementation, you would call the Medusa API with a search endpoint
        // For now, we'll just filter the mock products
        const { products } = await medusaApi.products.list()
        
        // Filter products by title or description containing the query
        const filteredProducts = products.filter(product => 
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
        )
        
        // Map to search results format
        const searchResults = filteredProducts.map(product => ({
          id: product.id,
          title: product.title,
          description: product.description,
          handle: product.handle,
          thumbnail: product.thumbnail,
          price: product.variants[0]?.prices[0]?.amount || 0,
          currency_code: product.variants[0]?.prices[0]?.currency_code || 'usd'
        }))
        
        setResults(searchResults.slice(0, 5)) // Limit to 5 results
      } catch (err) {
        console.error('Error searching products:', err)
      } finally {
        setLoading(false)
      }
    }
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      searchProducts()
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [query])
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) return
    
    // Close results
    setShowResults(false)
    
    // Navigate to search page with correct country prefix
    router.push(`/${country}/products?q=${encodeURIComponent(query)}`)
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setShowResults(!!value.trim())
  }
  
  const handleResultClick = (handle: string) => {
    setShowResults(false)
    setQuery('')
  }
  
  const clearSearch = () => {
    setQuery('')
    setResults([])
    setShowResults(false)
  }
  
  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearch} className="flex items-center">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search products..."
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" aria-hidden="true" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Search
        </button>
      </form>
      
      {/* Search results dropdown */}
      {showResults && (
        <div className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-md overflow-hidden">
          {loading ? (
            <div className="p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2.5"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2.5"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-2.5"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2.5"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : results.length > 0 ? (
            <ul role="list" className="divide-y divide-gray-200">
              {results.map((result) => (
                <li key={result.id}>
                  <Link
                    href={`/${country}/products/${result.handle}`}
                    onClick={() => handleResultClick(result.handle)}
                    className="block hover:bg-gray-50"
                  >
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md overflow-hidden">
                          {result.thumbnail ? (
                            <Image
                              src={result.thumbnail}
                              alt={result.title}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {result.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {result.description.substring(0, 60)}...
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="text-sm font-medium text-gray-900">
                          {formatPrice(result.price, result.currency_code)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
              
              <li className="px-4 py-2 text-center">
                <Link
                  href={`/${country}/products?q=${encodeURIComponent(query)}`}
                  onClick={() => setShowResults(false)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View all results
                </Link>
              </li>
            </ul>
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">No results found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}