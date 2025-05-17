import Medusa from "@medusajs/js-sdk"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
} else if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

// Get the API key from environment variables
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

// Increase timeout for requests to Medusa server
const REQUEST_TIMEOUT = 30000 // 30 seconds

// Initialize the SDK client with error handling
export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: PUBLISHABLE_API_KEY,
  maxRetries: 5,
  timeout: REQUEST_TIMEOUT,
})

// Create a wrapped client with better error handling
const originalFetch = sdk.client.fetch.bind(sdk.client)
sdk.client.fetch = async function wrappedFetch<T>(path: string, options: any = {}): Promise<T> {
  try {
    console.log(`Fetching ${path}...`)
    const startTime = Date.now()
    
    const result = await originalFetch<T>(path, {
      ...options,
      timeout: REQUEST_TIMEOUT,
    })
    
    const duration = Date.now() - startTime
    console.log(`Fetched ${path} in ${duration}ms`)
    
    return result
  } catch (error) {
    console.error(`Error fetching ${path}:`, error)
    
    // For certain endpoints, provide fallback data to prevent UI errors
    if (path.includes('/store/regions')) {
      return {
        regions: [
          {
            id: "fallback_region",
            name: "Fallback Region",
            countries: [
              { id: "dk", iso_2: "dk", display_name: "Denmark" }
            ]
          }
        ]
      } as unknown as T
    }
    
    // Handle auth-related endpoints with clearer error messages
    if (path.includes('/store/auth') || path.includes('/store/customers')) {
      if (error.toString().includes('timeout')) {
        throw new Error('Connection to authentication service timed out. Please try again later.')
      }
      
      if (error.toString().includes('429')) {
        throw new Error('Too many authentication attempts. Please try again later.')
      }
      
      if (error.toString().includes('401') || error.toString().includes('403')) {
        throw new Error('Invalid credentials. Please check your email and password.')
      }
    }
    
    // Re-throw the error for other endpoints
    throw error
  }
}

// Add a convenient function to check server connectivity
export async function checkMedusaServerStatus(): Promise<{
  isAvailable: boolean,
  message: string
}> {
  try {
    // Simple health check
    const response = await fetch(`${MEDUSA_BACKEND_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    })
    
    if (response.ok) {
      return { isAvailable: true, message: 'Medusa server is available' }
    } else {
      return { 
        isAvailable: false, 
        message: `Medusa server responded with status: ${response.status} ${response.statusText}`
      }
    }
  } catch (error) {
    return { 
      isAvailable: false, 
      message: error instanceof Error ? error.message : 'Unknown error connecting to Medusa server'
    }
  }
}
