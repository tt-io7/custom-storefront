"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

// Fallback collection for when the backend is unavailable
const FALLBACK_COLLECTION = {
  id: "fallback_collection",
  title: "Sample Collection",
  handle: "sample-collection",
  products: []
}

export const retrieveCollection = async (id: string) => {
  try {
    const next = {
      ...(await getCacheOptions("collections")),
    }

    return sdk.client
      .fetch<{ collection: HttpTypes.StoreCollection }>(
        `/store/collections/${id}`,
        {
          next,
          cache: "force-cache",
        }
      )
      .then(({ collection }) => collection)
  } catch (error) {
    console.error("Error retrieving collection:", error)
    return null
  }
}

interface CollectionQueryParams {
  countryCode?: string
  limit?: string
  offset?: string
  handle?: string
  fields?: string
  [key: string]: string | undefined
}

export const listCollections = async ({
  countryCode, // We accept countryCode but don't use it in the API call
  ...queryParams
}: CollectionQueryParams = {}): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  try {
    // Set defaults but don't include countryCode in API request
    const cleanedParams: Record<string, string> = {
      limit: "100",
      offset: "0",
      ...queryParams,
    }
    
    // Remove any invalid parameters that Medusa API doesn't accept
    delete cleanedParams.countryCode;
    
    // Remove any empty string parameters
    Object.keys(cleanedParams).forEach(key => {
      if (cleanedParams[key] === '') {
        delete cleanedParams[key];
      }
    });
    
    console.log("Fetching collections with query:", cleanedParams)

    try {
      // Try using the SDK directly first
      const result = await sdk.store.collection.list(cleanedParams);
      return { 
        collections: result.collections || [], 
        count: result.count || 0
      }
    } catch (sdkError) {
      console.warn("SDK error, falling back to fetch:", sdkError)
      
      // Fallback to direct fetch
      const next = { ...(await getCacheOptions("collections")) }
      
      const response = await sdk.client
        .fetch<{ collections: HttpTypes.StoreCollection[]; count: number }>(
          "/store/collections",
          {
            query: cleanedParams,
            next,
            cache: "force-cache",
          }
        )
      
      return { 
        collections: response.collections || [], 
        count: response.count || 0
      }
    }
  } catch (error) {
    console.error("Error fetching collections:", error)
    // Return a fallback collection so the UI doesn't break
    return { 
      collections: [FALLBACK_COLLECTION], 
      count: 1 
    }
  }
}

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection | null> => {
  try {
    const next = {
      ...(await getCacheOptions("collections")),
    }

    try {
      // Try using the SDK first
      const response = await sdk.store.collection.list({ handle });
      return response.collections?.[0] || null;
    } catch (sdkError) {
      console.warn("SDK error, falling back to fetch:", sdkError)
      
      // Follow Medusa documentation format for collection queries
      const response = await sdk.client
        .fetch<HttpTypes.StoreCollectionListResponse>(`/store/collections`, {
          query: { handle },
          next,
          cache: "force-cache",
        })
          
      return response.collections?.[0] || null
    }
  } catch (error) {
    console.error("Error fetching collection by handle:", error)
    // Return the fallback collection if we were looking for the sample-collection handle
    if (handle === "sample-collection") {
      return FALLBACK_COLLECTION
    }
    return null
  }
}
