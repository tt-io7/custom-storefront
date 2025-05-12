// medusa.ts - A lightweight client for Medusa API using fetch
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
// Use environment variable for API key
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c'

/**
 * General API fetch function with error handling
 */
export async function medusaFetch<T>({
  method = "GET",
  path = "",
  payload,
}: {
  method?: string;
  path: string;
  payload?: any;
}): Promise<T> {
  // Ensure the publishable API key is included in all requests
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "x-publishable-api-key": PUBLISHABLE_API_KEY
    },
    credentials: "include",
    // Add cache control to prevent caching of authentication requests
    cache: method.toUpperCase() === 'GET' ? 'default' : 'no-store',
  };

  console.log('Using publishable API key:', PUBLISHABLE_API_KEY);

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  try {
    // Special handling for registration and login
    const isAuthEndpoint = (
      (path === '/customers' && method.toUpperCase() === 'POST') || // Registration
      (path === '/customers/token' && method.toUpperCase() === 'POST') // Login
    );

    // Make sure we don't have double /store/ in the URL
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const fullPath = normalizedPath.startsWith('/store/') ? normalizedPath : `/store${normalizedPath}`;

    console.log(`Making request to ${MEDUSA_BACKEND_URL}${fullPath}`);
    const response = await fetch(`${MEDUSA_BACKEND_URL}${fullPath}`, options);

    if (!response.ok) {
      // Handle 401 Unauthorized errors specifically, but skip for auth endpoints
      if (response.status === 401 && !isAuthEndpoint) {
        console.error("Authentication error: User is not authorized");
        throw new Error("You are not authorized. Please log in again.");
      }

      // Log request details for all errors
      console.error('Request details:', {
        url: `${MEDUSA_BACKEND_URL}${fullPath}`,
        method,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      // First try to get the response text to check if it's HTML
      let responseText;
      try {
        responseText = await response.clone().text();

        // Check if the response is HTML (starts with <!DOCTYPE or <html)
        if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
          console.error('Received HTML instead of JSON:', responseText.substring(0, 100) + '...');
          throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}`);
        }

        // Try to parse as JSON if it doesn't look like HTML
        try {
          const error = JSON.parse(responseText);
          console.error(`API error:`, error);
          throw new Error(error.message || error.error || "An error occurred");
        } catch (jsonParseError) {
          // If it's not HTML and not valid JSON
          console.error(`Response is not valid JSON:`, responseText.substring(0, 100) + '...');
          throw new Error(`Request failed with status ${response.status}. Invalid response format.`);
        }
      } catch (textError) {
        console.error(`Could not get response text:`, textError);
        throw new Error(`Request failed with status ${response.status}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching from Medusa:", error);
    throw error;
  }
}

/**
 * Products API
 */
export const products = {
  /**
   * Get a list of products
   */
  list: async (params?: any) => {
    const queryParams = params ? `?${new URLSearchParams(params).toString()}` : "";
    return medusaFetch<{ products: any[]; count: number }>({
      path: `/products${queryParams}`,
    });
  },

  /**
   * Get a product by handle
   */
  retrieve: async (handle: string) => {
    return medusaFetch<{ product: any }>({
      path: `/products/${handle}`,
    });
  },
};

/**
 * Collections API
 */
export const collections = {
  /**
   * Get a list of collections
   */
  list: async () => {
    return medusaFetch<{ collections: any[] }>({
      path: "/collections",
    });
  },

  /**
   * Get a collection by handle
   */
  retrieve: async (handle: string) => {
    return medusaFetch<{ collection: any }>({
      path: `/collections/${handle}`,
    });
  },
};

/**
 * Cart API
 */
export const carts = {
  /**
   * Create a cart
   */
  create: async () => {
    return medusaFetch<{ cart: any }>({
      method: "POST",
      path: "/store/carts",
    });
  },

  /**
   * Get a cart by ID
   */
  retrieve: async (cartId: string) => {
    return medusaFetch<{ cart: any }>({
      path: `/store/carts/${cartId}`,
    });
  },

  /**
   * Add a line item to cart
   */
  addLineItem: async (cartId: string, lineItem: any) => {
    return medusaFetch<{ cart: any }>({
      method: "POST",
      path: `/store/carts/${cartId}/line-items`,
      payload: lineItem,
    });
  },

  /**
   * Update a line item in cart
   */
  updateLineItem: async (cartId: string, lineId: string, quantity: number) => {
    return medusaFetch<{ cart: any }>({
      method: "POST",
      path: `/store/carts/${cartId}/line-items/${lineId}`,
      payload: { quantity },
    });
  },

  /**
   * Remove a line item from cart
   */
  removeLineItem: async (cartId: string, lineId: string) => {
    return medusaFetch<{ cart: any }>({
      method: "DELETE",
      path: `/store/carts/${cartId}/line-items/${lineId}`,
    });
  },

  /**
   * Apply a discount to a cart
   */
  applyDiscount: async (cartId: string, code: string) => {
    return medusaFetch<{ cart: any }>({
      method: "POST",
      path: `/store/carts/${cartId}/discounts`,
      payload: { code },
    });
  },
};

// Export the API client
const medusaApi = {
  products,
  collections,
  carts,
};

export default medusaApi;