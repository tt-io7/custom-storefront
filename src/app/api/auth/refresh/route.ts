import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No authorization token provided" },
        { status: 401 }
      )
    }
    
    const token = authHeader.split(" ")[1]
    const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://backend-production-1aec.up.railway.app"
    const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_01HNHNZ3YB04JZQR3YVFP0FC49"
    
    // Proxy the request to Medusa backend for token refresh
    const response = await fetch(`${MEDUSA_BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
        "x-publishable-api-key": PUBLISHABLE_API_KEY
      }
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to refresh token: ${response.statusText}` },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in /api/auth/refresh:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 