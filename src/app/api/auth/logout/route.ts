import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    // We don't need to call the Medusa backend for logout
    // We just need to clear cookies on the client side

    const response = NextResponse.json({ success: true })
    
    // Clear any cookies related to authentication
    response.cookies.delete("_medusa_jwt")
    
    return response
  } catch (error) {
    console.error("Error in /api/auth/logout:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 