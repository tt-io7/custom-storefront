"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const retrieveCollection = async (id: string) => {
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
}

interface CollectionQueryParams {
  countryCode?: string
  limit?: string
  offset?: string
  handle?: string
  [key: string]: string | undefined
}

export const listCollections = async ({
  countryCode, // We accept countryCode but don't use it in the API call
  ...queryParams
}: CollectionQueryParams = {}): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

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
      collections: response.collections, 
      count: response.collections.length 
    }
  } catch (error) {
    console.error("Error fetching collections:", error)
    return { collections: [], count: 0 }
  }
}

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection | null> => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  try {
    // Follow Medusa documentation format for collection queries
    const response = await sdk.client
      .fetch<HttpTypes.StoreCollectionListResponse>(`/store/collections`, {
        query: { 
          handle
        },
        next,
        cache: "force-cache",
      })
      
    return response.collections[0] || null
  } catch (error) {
    console.error("Error fetching collection by handle:", error)
    return null
  }
}
