import { redirect } from "next/navigation"

// Default country code - same as in middleware.ts
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

export default function RootPage() {
  // Redirect to the default country code
  redirect(`/${DEFAULT_REGION}`)
  
  // This won't be reached due to the redirect, but it's here for completeness
  return null
} 