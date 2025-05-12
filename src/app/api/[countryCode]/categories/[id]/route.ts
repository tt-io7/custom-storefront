"use server"

import { sdk } from "@lib/config"
import { getCategoryById } from "@lib/data/categories"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { countryCode: string; id: string } }
) {
  const { id } = params
  const searchParams = request.nextUrl.searchParams

  // Get query params
  const limit = parseInt(searchParams.get("limit") || "12", 10)
  const offset = parseInt(searchParams.get("offset") || "0", 10)
  const order = searchParams.get("order") || undefined
  
  try {
    // Get the category first
    const category = await getCategoryById(id)
    
    if (!category) {
      console.error(`Category not found with ID: ${id}`)
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }
    
    console.log(`Fetching products for category ${id} (${category.name})`)
    
    // Get products for category
    const productsResponse = await sdk.client.fetch(
      "/store/products",
      {
        method: "GET",
        query: {
          category_id: [id],
          limit,
          offset,
          order,
        },
        next: { revalidate: 30 }, // Cache for 30 seconds
      }
    )
    
    console.log(`Found ${productsResponse?.count || 0} products for category ${category.name}`)
    
    return NextResponse.json(productsResponse)
  } catch (error) {
    console.error("Error fetching category products:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 