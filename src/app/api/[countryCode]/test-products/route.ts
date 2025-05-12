"use server"

import { sdk } from "@lib/config"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { countryCode: string } }
) {
  try {
    console.log("Testing direct product fetch")
    
    // Fetch products with minimal filtering
    const productsResponse = await sdk.client.fetch(
      "/store/products",
      {
        method: "GET",
        query: {
          limit: 10,
          offset: 0,
        },
        next: { revalidate: 0 }, // Don't cache
      }
    )
    
    console.log(`Direct fetch found ${productsResponse?.count || 0} products`)
    console.log("Sample products:", 
      productsResponse?.products?.slice(0, 2).map(p => ({ 
        id: p.id, 
        title: p.title,
        status: p.status
      }))
    )
    
    return NextResponse.json({
      success: true,
      count: productsResponse?.count || 0,
      products: productsResponse?.products || []
    })
  } catch (error) {
    console.error("Error in test-products route:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch products", 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
} 