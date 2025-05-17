'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SearchBar from './SearchBar'

export default function Header() {
  const pathname = usePathname()
  const [country, setCountry] = useState('dk') // Default country
  const [showSearch, setShowSearch] = useState(false)

  // Get country from pathname
  useEffect(() => {
    if (pathname) {
      const match = pathname.match(/^\/([^\/]+)/)
      if (match && match[1] !== '[country]') {
        setCountry(match[1])
      } else {
        // If no country in path, ensure we use the default
        setCountry('dk')
      }
    }
  }, [pathname])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-md py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={`/${country}`} className="flex items-center">
              <span className="font-serif text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                AndMore
              </span>
              <span className="ml-1 text-xs font-medium text-gold-600 mt-1">PREMIUM TECH</span>
            </Link>
          </div>
          {/* Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <div className="flex space-x-8">
              <Link className="text-sm font-medium text-gray-700 hover:text-primary" href={`/${country}`}>Home</Link>
              <Link className="text-sm font-medium text-gray-700 hover:text-primary" href={`/${country}/store`}>Store</Link>
              <Link className="text-sm font-medium text-gray-700 hover:text-primary" href={`/${country}/products`}>Products</Link>
              <Link className="text-sm font-medium text-gray-700 hover:text-primary" href={`/${country}/categories`}>Categories</Link>
              <Link className="text-sm font-medium text-gray-700 hover:text-primary" href={`/${country}/about`}>About</Link>
              <Link className="text-sm font-medium text-gray-700 hover:text-primary" href={`/${country}/contact`}>Contact</Link>
            </div>
          </nav>
          {/* Right-side icons */}
          <div className="flex items-center space-x-6">
            {/* Search Icon */}
            <button 
              type="button" 
              className="text-gray-700 hover:text-primary transition-colors" 
              aria-label="Search"
              onClick={() => setShowSearch(!showSearch)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
            {/* Account Icon */}
            <div className="relative">
              <Link href={`/${country}/account`} className="text-gray-700 hover:text-primary transition-colors" aria-label="Account">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"></path>
                </svg>
              </Link>
            </div>
            {/* Cart Icon */}
            <Link href={`/${country}/cart`} className="text-gray-700 hover:text-primary transition-colors relative" aria-label="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"></path>
              </svg>
            </Link>
          </div>
        </div>

        {/* Search Bar (shown when search icon is clicked) */}
        {showSearch && (
          <div className="mt-4 pb-2">
            <SearchBar />
          </div>
        )}
      </div>
    </header>
  )
}