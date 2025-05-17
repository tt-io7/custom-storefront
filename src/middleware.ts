import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "dk"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!BACKEND_URL) {
    throw new Error(
      "Middleware.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL."
    )
  }

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
    const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: {
        "x-publishable-api-key": PUBLISHABLE_API_KEY!,
      },
      next: {
        revalidate: 3600,
        tags: [`regions-${cacheId}`],
      },
      cache: "force-cache",
    }).then(async (response) => {
      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.message)
      }

      return json
    })

    if (!regions?.length) {
      throw new Error(
        "No regions found. Please set up regions in your Medusa Admin."
      )
    }

    // Create a map of country codes to regions.
    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        regionMapCache.regionMap.set(c.iso_2 ?? "", region)
      })
    })

    regionMapCache.regionMapUpdated = Date.now()
  }

  return regionMapCache.regionMap
}

/**
 * Fetches regions from Medusa and sets the region cookie.
 * @param request
 * @param response
 */
async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value
    }

    return countryCode || DEFAULT_REGION
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL."
      )
    }
    return DEFAULT_REGION
  }
}

/**
 * Middleware to handle region selection and onboarding status.
 */
export async function middleware(request: NextRequest) {
  // Skip middleware for health check endpoints or root path
  if (request.nextUrl.pathname === "/api/health" || 
      request.nextUrl.pathname === "/") {
    return NextResponse.next()
  }

  try {
    let redirectUrl = request.nextUrl.href
    let response = NextResponse.redirect(redirectUrl, 307)
    let cacheIdCookie = request.cookies.get("_medusa_cache_id")
    let cacheId = cacheIdCookie?.value || crypto.randomUUID()
    
    const regionMap = await getRegionMap(cacheId)
    const countryCode = regionMap && (await getCountryCode(request, regionMap))
    
    const urlPath = request.nextUrl.pathname.split("/")
    const urlHasCountryCode = urlPath[1] === countryCode
    
    // Handle special case for root URL without country code
    if (urlPath.length === 2 && urlPath[1] === "store") {
      // Redirect /store to /dk/store
      redirectUrl = `${request.nextUrl.origin}/${countryCode}/store${request.nextUrl.search}`
      response = NextResponse.redirect(redirectUrl, 307)
      response.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
      })
      return response
    }
    
    // Handle special case for product URLs without country code
    if (urlPath.length >= 3 && urlPath[1] === "products") {
      // Redirect /products/handle to /dk/products/handle
      const newPath = `/${countryCode}/${urlPath.slice(1).join('/')}`
      redirectUrl = `${request.nextUrl.origin}${newPath}${request.nextUrl.search}`
      response = NextResponse.redirect(redirectUrl, 307)
      response.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
      })
      return response
    }
    
    // Handle case where URL has wrong country code
    if (urlPath[1] && urlPath[1] !== countryCode && urlPath[1] !== "api" && !urlPath[1].includes(".")) {
      // e.g., /us/store -> /dk/store
      const newPath = `/${countryCode}/${urlPath.slice(2).join('/')}`
      redirectUrl = `${request.nextUrl.origin}${newPath}${request.nextUrl.search}`
      response = NextResponse.redirect(redirectUrl, 307)
      response.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
      })
      return response
    }
    
    // If URL has proper country code and has cache ID, allow through
    if (urlHasCountryCode && cacheIdCookie) {
      return NextResponse.next()
    }
    
    // If URL has proper country code but no cache ID, set it
    if (urlHasCountryCode && !cacheIdCookie) {
      response.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
      })
      return response
    }
    
    // For static assets
    if (request.nextUrl.pathname.includes(".")) {
      return NextResponse.next()
    }
    
    // For cases where URL has no country code
    const redirectPath = request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname
    const queryString = request.nextUrl.search ? request.nextUrl.search : ""
    
    redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`
    response = NextResponse.redirect(redirectUrl, 307)
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
    })
    
    return response
  } catch (error) {
    console.error("Middleware error:", error)
    // For any middleware errors, allow the request to proceed
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    "/((?!^/$|api/health|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
