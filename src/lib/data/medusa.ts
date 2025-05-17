import { HttpTypes } from '@medusajs/types'

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

/**
 * Get collections from Medusa
 */
export async function getCollections({ 
  limit = 10, 
  offset = 0 
}: { 
  limit?: number, 
  offset?: number 
}): Promise<{ collections: HttpTypes.StoreCollection[] }> {
  const response = await fetch(
    `${MEDUSA_BACKEND_URL}/store/collections?limit=${limit}&offset=${offset}`,
    {
      headers: {
        'x-publishable-api-key': API_KEY || '',
      },
      next: { revalidate: 3600 },
    }
  )

  if (!response.ok) {
    throw new Error(`Error fetching collections: ${response.statusText}`)
  }

  return await response.json()
}

/**
 * Get products by IDs
 */
export async function getProductsById({ 
  product_ids 
}: { 
  product_ids: string[] 
}): Promise<{ products: HttpTypes.StoreProduct[] }> {
  const ids = product_ids.join(',')
  
  const response = await fetch(
    `${MEDUSA_BACKEND_URL}/store/products?ids=${ids}`,
    {
      headers: {
        'x-publishable-api-key': API_KEY || '',
      },
      next: { revalidate: 3600 },
    }
  )

  if (!response.ok) {
    throw new Error(`Error fetching products: ${response.statusText}`)
  }

  return await response.json()
} 