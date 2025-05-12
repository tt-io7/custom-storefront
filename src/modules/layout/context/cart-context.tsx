'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import medusaApi from '../lib/medusa'
import MiniCart from '../components/MiniCart'

// Types
interface LineItem {
  id: string
  title: string
  variant_id: string
  quantity: number
  unit_price: number
  thumbnail?: string
}

interface Cart {
  id: string
  items: LineItem[]
  total: number
  subtotal: number
  discount_total: number
  shipping_total: number
  tax_total: number
}

interface CartContextType {
  cart: Cart | null
  loading: boolean
  error: Error | null
  addItem: (variantId: string, quantity: number) => Promise<void>
  updateItem: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  applyDiscount: (code: string) => Promise<void>
  clearCart: () => void
  openMiniCart: () => void
  closeMiniCart: () => void
  isMiniCartOpen: boolean
  itemCount: number
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Hook for using the cart context
export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const useCartContext = useCart // Alias for backward compatibility

// Provider component
export const CartContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [cartId, setCartId] = useLocalStorage<string | null>('medusa_cart_id', null)
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false)
  const [itemCount, setItemCount] = useState(0)
  const [showAddedAnimation, setShowAddedAnimation] = useState(false)
  
  // Initialize cart
  useEffect(() => {
    const initializeCart = async () => {
      setLoading(true)
      setError(null)

      try {
        if (cartId) {
          // Try to retrieve existing cart
          try {
            const { cart: existingCart } = await medusaApi.carts.retrieve(cartId)
            setCart(mapMedusaCart(existingCart))
            setLoading(false)
            return
          } catch (err) {
            console.warn('Could not find existing cart, creating new one')
            // If cart doesn't exist, create a new one
            setCartId(null)
          }
        }

        // Create a new cart
        const { cart: newCart } = await medusaApi.carts.create()
        setCartId(newCart.id)
        setCart(mapMedusaCart(newCart))
      } catch (err) {
        console.error('Error initializing cart:', err)
        setError(err instanceof Error ? err : new Error('Failed to initialize cart'))
      } finally {
        setLoading(false)
      }
    }

    initializeCart()
  }, [cartId, setCartId])

  // Update item count when cart changes
  useEffect(() => {
    if (cart) {
      const count = cart.items.reduce((total, item) => total + item.quantity, 0)
      
      // If item count increased, show animation
      if (count > itemCount) {
        setShowAddedAnimation(true)
        setTimeout(() => {
          setShowAddedAnimation(false)
        }, 1500)
      }
      
      setItemCount(count)
    } else {
      setItemCount(0)
    }
  }, [cart, itemCount])
  
  const openMiniCart = () => {
    setIsMiniCartOpen(true)
  }
  
  const closeMiniCart = () => {
    setIsMiniCartOpen(false)
  }
  
  // Add item to cart
  const addItem = async (variantId: string, quantity: number) => {
    if (!cart) return

    setLoading(true)
    setError(null)

    try {
      const { cart: updatedCart } = await medusaApi.carts.addLineItem(cart.id, {
        variant_id: variantId,
        quantity,
      })
      setCart(mapMedusaCart(updatedCart))
    } catch (err) {
      console.error('Error adding item to cart:', err)
      setError(err instanceof Error ? err : new Error('Failed to add item to cart'))
    } finally {
      setLoading(false)
    }
  }

  // Update item quantity
  const updateItem = async (lineId: string, quantity: number) => {
    if (!cart) return

    setLoading(true)
    setError(null)

    try {
      const { cart: updatedCart } = await medusaApi.carts.updateLineItem(cart.id, lineId, quantity)
      setCart(mapMedusaCart(updatedCart))
    } catch (err) {
      console.error('Error updating item quantity:', err)
      setError(err instanceof Error ? err : new Error('Failed to update item quantity'))
    } finally {
      setLoading(false)
    }
  }

  // Remove item from cart
  const removeItem = async (lineId: string) => {
    if (!cart) return

    setLoading(true)
    setError(null)

    try {
      const { cart: updatedCart } = await medusaApi.carts.removeLineItem(cart.id, lineId)
      setCart(mapMedusaCart(updatedCart))
    } catch (err) {
      console.error('Error removing item from cart:', err)
      setError(err instanceof Error ? err : new Error('Failed to remove item from cart'))
    } finally {
      setLoading(false)
    }
  }

  // Apply discount
  const applyDiscount = async (code: string) => {
    if (!cart) return

    setLoading(true)
    setError(null)

    try {
      const { cart: updatedCart } = await medusaApi.carts.applyDiscount(cart.id, code)
      setCart(mapMedusaCart(updatedCart))
    } catch (err) {
      console.error('Error applying discount:', err)
      setError(err instanceof Error ? err : new Error('Failed to apply discount'))
    } finally {
      setLoading(false)
    }
  }

  // Clear cart
  const clearCart = () => {
    setCartId(null)
    setCart(null)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addItem,
        updateItem,
        removeItem,
        applyDiscount,
        clearCart,
        openMiniCart,
        closeMiniCart,
        isMiniCartOpen,
        itemCount,
      }}
    >
      {children}
      <MiniCart isOpen={isMiniCartOpen} onClose={closeMiniCart} />
      
      {/* Item added animation */}
      {showAddedAnimation && (
        <div className="fixed bottom-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg animate-bounce">
          Item added to cart!
        </div>
      )}
    </CartContext.Provider>
  )
}

// Helper to map Medusa cart to our Cart type
function mapMedusaCart(medusaCart: any): Cart {
  return {
    id: medusaCart.id,
    items: medusaCart.items?.map((item: any) => ({
      id: item.id,
      title: item.title,
      variant_id: item.variant_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      thumbnail: item.thumbnail,
    })) || [],
    total: medusaCart.total || 0,
    subtotal: medusaCart.subtotal || 0,
    discount_total: medusaCart.discount_total || 0,
    shipping_total: medusaCart.shipping_total || 0,
    tax_total: medusaCart.tax_total || 0,
  }
}

// Local storage hook (if not already defined elsewhere)
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}