'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'

interface WishlistItem {
  id: string
  productId: string
  variantId: string
  title: string
  variantTitle: string
  thumbnail?: string
  price: number
  currencyCode: string
  handle: string
  addedAt: string
}

interface WishlistContext {
  wishlist: WishlistItem[]
  loading: boolean
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void
  removeItem: (variantId: string) => void
  clearWishlist: () => void
  isInWishlist: (variantId: string) => boolean
}

// Local storage key for wishlist
const WISHLIST_KEY = 'medusa_wishlist'

const WishlistContext = createContext<WishlistContext | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  
  // Load wishlist from localStorage on mount
  useEffect(() => {
    const loadWishlist = () => {
      setLoading(true)
      
      try {
        if (typeof window !== 'undefined') {
          const storedWishlist = localStorage.getItem(WISHLIST_KEY)
          
          if (storedWishlist) {
            setWishlist(JSON.parse(storedWishlist))
          }
        }
      } catch (err) {
        console.error('Error loading wishlist:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadWishlist()
  }, [])
  
  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && !loading) {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
    }
  }, [wishlist, loading])
  
  // Add item to wishlist
  const addItem = useCallback((item: Omit<WishlistItem, 'addedAt'>) => {
    setWishlist(prev => {
      // Check if item already exists
      if (prev.some(i => i.variantId === item.variantId)) {
        return prev
      }
      
      // Add new item with current date
      return [...prev, {
        ...item,
        addedAt: new Date().toISOString()
      }]
    })
  }, [])
  
  // Remove item from wishlist
  const removeItem = useCallback((variantId: string) => {
    setWishlist(prev => prev.filter(item => item.variantId !== variantId))
  }, [])
  
  // Clear wishlist
  const clearWishlist = useCallback(() => {
    setWishlist([])
  }, [])
  
  // Check if item is in wishlist
  const isInWishlist = useCallback((variantId: string) => {
    return wishlist.some(item => item.variantId === variantId)
  }, [wishlist])
  
  const value = {
    wishlist,
    loading,
    addItem,
    removeItem,
    clearWishlist,
    isInWishlist
  }
  
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}