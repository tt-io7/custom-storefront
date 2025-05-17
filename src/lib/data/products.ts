"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

/**
 * This will attempt to list products from the API.
 * If there are API connectivity issues or no products found, it will return empty results without failing.
 */
export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams & {
    category_id?: string;
    collection_id?: string;
    handle?: string;
  }
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  try {
    if (!countryCode && !regionId) {
      throw new Error("Country code or region ID is required")
    }

    const limit = queryParams?.limit || 12
    const _pageParam = Math.max(pageParam, 1)
    const offset = (_pageParam === 1) ? 0 : (_pageParam - 1) * limit;

    let region: HttpTypes.StoreRegion | undefined | null

    if (countryCode) {
      region = await getRegion(countryCode)
    } else {
      region = await retrieveRegion(regionId!)
    }

    if (!region) {
      console.error(`Region not found for ${countryCode || regionId}`)
      return {
        response: { products: [], count: 0 },
        nextPage: null,
      }
    }

    // Build query according to Medusa API v2 specification
    const queryObject: Record<string, any> = {
      limit,
      offset,
      region_id: region?.id
    }
    
    // Only include valid queryParams properties
    if (queryParams) {
      // Safely copy queryParams as a Record to avoid TypeScript errors
      const params = queryParams as Record<string, any>;
      
      // Add standard Medusa API parameters according to documentation
      if (params.ids) queryObject.ids = params.ids;
      if (params.q) queryObject.q = params.q;
      if (params.collection_id) {
        queryObject.collection_id = params.collection_id;
        console.log(`Filtering by collection: ${params.collection_id}`);
      }
      if (params.tags) queryObject.tags = params.tags;
      if (params.price_list_id) queryObject.price_list_id = params.price_list_id;
      if (params.sales_channel_id) queryObject.sales_channel_id = params.sales_channel_id;
      if (params.category_id) {
        queryObject.category_id = params.category_id;
        console.log(`Filtering by category: ${params.category_id}`);
      }
      if (params.include_category_children) queryObject.include_category_children = params.include_category_children;
      if (params.type_id) queryObject.type_id = params.type_id;
      if (params.created_at) queryObject.created_at = params.created_at;
      if (params.updated_at) queryObject.updated_at = params.updated_at;
      if (params.handle) {
        queryObject.handle = params.handle;
        console.log(`Fetching product with handle: ${params.handle}`);
      }
    }
    
    // Remove any properties with undefined or empty string values
    Object.keys(queryObject).forEach(key => {
      if (queryObject[key] === undefined || queryObject[key] === '') {
        delete queryObject[key];
      }
    });
    
    // Try to directly call the API without using cookies if possible
    try {
      const query = new URLSearchParams();
      
      // Add all query parameters
      Object.entries(queryObject).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => query.append(key, v));
        } else if (value !== undefined && value !== null) {
          query.append(key, value.toString());
        }
      });
      
      // Convert query to string
      const queryString = query.toString();
      
      // Log query for debugging
      console.log(`Fetching products with query: ${queryString}`);
      
      // Make the API call with the SDK
      const { products = [], count = 0 } = await sdk.store.product.list(queryObject);
      
      console.log(`Found ${products.length} products`);
      
      // Calculate if there's a next page
      const nextPage = count > offset + limit ? _pageParam + 1 : null;
      
      return {
        response: { products, count },
        nextPage,
        queryParams,
      };
    } catch (error) {
      console.error("Error in listProducts:", error);
      
      // Return empty results in case of an error
      return {
        response: { products: [], count: 0 },
        nextPage: null,
      }
    }
  } catch (error) {
    console.error("Error in listProducts:", error);
    
    // Fallback to empty response on any error
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
}
