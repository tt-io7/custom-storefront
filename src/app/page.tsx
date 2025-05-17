import { redirect } from "next/navigation"
import Link from "next/link"

// Default country code - same as in middleware.ts
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

export default function RootPage() {
  // Only redirect for client-side rendering or if SKIP_REDIRECT is not set
  if (typeof window !== "undefined") {
    redirect(`/${DEFAULT_REGION}`)
  }
  
  // For server-side rendering (including Railway healthcheck), show a basic HTML page
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Medusa Storefront</h1>
      <p className="mb-6">Welcome to the Medusa Storefront</p>
      <Link 
        href={`/${DEFAULT_REGION}`} 
        className="py-2 px-4 bg-black text-white rounded-md"
      >
        Go to Store
      </Link>
    </div>
  )
} 