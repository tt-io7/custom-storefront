import Medusa from "@medusajs/js-sdk"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
}

// Get the API key from environment variables
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

// Timeout for requests to Medusa server
const REQUEST_TIMEOUT = 5000 // 5 seconds 

// Initialize the SDK client
export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: PUBLISHABLE_API_KEY,
})

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
