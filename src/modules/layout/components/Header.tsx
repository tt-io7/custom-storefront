'use client'

import { useState, useEffect, memo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SearchBar from './SearchBar'
import { motion, AnimatePresence } from 'framer-motion'

// Memoized nav link to prevent unnecessary rerenders
const NavLink = memo(({ href, children, isActive }: { href: string, children: React.ReactNode, isActive: boolean }) => (
  <Link 
    className={`text-sm font-medium transition duration-200 relative px-2 py-1
      ${isActive 
        ? 'text-primary' 
        : 'text-gray-700 hover:text-primary'
      }`}
    href={href}
  >
    {children}
    {isActive && (
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
    )}
  </Link>
))

NavLink.displayName = 'NavLink'

export default function Header() {
  const pathname = usePathname()
  const [country, setCountry] = useState('dk') // Default country
  const [showSearch, setShowSearch] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
  
  // Add scroll detection for better UX
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check if a nav link is active
  const isLinkActive = (path: string) => {
    if (!pathname) return false
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${isScrolled 
        ? 'bg-white shadow-md py-2' 
        : 'bg-white/90 backdrop-blur-sm py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={`/${country}`} className="flex items-center group">
              <span className="font-serif text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
                AndMore
              </span>
              <span className="ml-1 text-xs font-medium text-gold-600 mt-1">PREMIUM TECH</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-gray-700 hover:text-primary focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <div className="flex space-x-8">
              <NavLink href={`/${country}`} isActive={isLinkActive(`/${country}`)}>Home</NavLink>
              <NavLink href={`/${country}/store`} isActive={isLinkActive(`/${country}/store`)}>Store</NavLink>
              <NavLink href={`/${country}/products`} isActive={isLinkActive(`/${country}/products`)}>Products</NavLink>
              <NavLink href={`/${country}/categories`} isActive={isLinkActive(`/${country}/categories`)}>Categories</NavLink>
              <NavLink href={`/${country}/about`} isActive={isLinkActive(`/${country}/about`)}>About</NavLink>
              <NavLink href={`/${country}/contact`} isActive={isLinkActive(`/${country}/contact`)}>Contact</NavLink>
            </div>
          </nav>

          {/* Right-side icons */}
          <div className="flex items-center space-x-6">
            {/* Search Icon */}
            <button 
              type="button" 
              className="text-gray-700 hover:text-primary transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-lilac-100" 
              aria-label="Search"
              onClick={() => setShowSearch(!showSearch)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>

            {/* Account Icon */}
            <div className="relative group">
              <Link 
                href={`/${country}/account`} 
                className="text-gray-700 hover:text-primary transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-lilac-100" 
                aria-label="Account"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"></path>
                </svg>
                <span className="ml-1 text-sm hidden lg:inline">Account</span>
              </Link>
              
              {/* Quick account dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 transform opacity-0 scale-95 transition-all duration-200 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto border border-gray-100">
                <Link href={`/${country}/account`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-lilac-50 hover:text-primary">
                  My Account
                </Link>
                <Link href={`/${country}/account/@login`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-lilac-50 hover:text-primary">
                  Sign In / Register
                </Link>
              </div>
            </div>

            {/* Cart Icon */}
            <Link 
              href={`/${country}/cart`} 
              className="text-gray-700 hover:text-primary transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-lilac-100" 
              aria-label="Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"></path>
              </svg>
              <span className="ml-1 text-sm hidden lg:inline">Cart</span>
            </Link>
          </div>
        </div>

        {/* Search Bar (shown when search icon is clicked) */}
        <AnimatePresence>
          {showSearch && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pb-2 overflow-hidden"
            >
              <SearchBar />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile menu (slides down when menu button is clicked) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-1 sm:px-6">
              <Link href={`/${country}`} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-lilac-50">
                Home
              </Link>
              <Link href={`/${country}/store`} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-lilac-50">
                Store
              </Link>
              <Link href={`/${country}/products`} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-lilac-50">
                Products
              </Link>
              <Link href={`/${country}/categories`} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-lilac-50">
                Categories
              </Link>
              <Link href={`/${country}/about`} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-lilac-50">
                About
              </Link>
              <Link href={`/${country}/contact`} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-lilac-50">
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}