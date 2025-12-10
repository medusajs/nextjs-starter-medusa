import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
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
      "Middleware.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a NEXT_PUBLIC_MEDUSA_BACKEND_URL environment variable."
    )
  }

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
    let response
    try {
      // Use AbortController for timeout in case of network issues
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      try {
        response = await fetch(`${BACKEND_URL}/store/regions`, {
          method: "GET",
          headers: {
            "x-publishable-api-key": PUBLISHABLE_API_KEY!,
            "User-Agent": "Mozilla/5.0 (compatible; Medusa-Storefront/1.0)",
            Accept: "application/json",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
            Referer: `${BACKEND_URL}/`,
          },
          // Cloudflare Workers doesn't support Next.js-specific fetch options
          // Use standard fetch with cache headers instead
          cache: "no-store", // Don't cache to avoid stale data
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
      } catch (fetchErr) {
        clearTimeout(timeoutId)
        if (fetchErr instanceof Error && fetchErr.name === "AbortError") {
          throw new Error(
            "Request timeout: Backend did not respond within 10 seconds"
          )
        }
        throw fetchErr
      }
    } catch (fetchError) {
      console.error("Failed to fetch regions:", fetchError)
      throw new Error(
        `Failed to fetch regions from backend: ${
          fetchError instanceof Error ? fetchError.message : "Unknown error"
        }`
      )
    }

    if (!response.ok) {
      const text = await response.text()
      console.error(`Backend returned ${response.status}:`, text)

      // If it's a Cloudflare error 1003, this is a security block
      // Return empty map to allow fallback behavior
      if (response.status === 403 && text.includes("1003")) {
        console.warn(
          "Cloudflare security block (1003) - backend request blocked. Using fallback."
        )
        return new Map<string, HttpTypes.StoreRegion>()
      }

      throw new Error(
        `Backend returned ${response.status}: ${text.substring(0, 100)}`
      )
    }

    let json
    try {
      json = await response.json()
    } catch (parseError) {
      const text = await response.text()
      console.error("Failed to parse response:", text)
      throw new Error(
        `Failed to parse backend response: ${
          parseError instanceof Error ? parseError.message : "Unknown error"
        }`
      )
    }

    const { regions } = json

    if (!regions?.length) {
      console.warn(
        "No regions found in backend response. Backend may not have regions configured."
      )
      // Don't throw - return empty map instead to allow graceful handling
      return new Map<string, HttpTypes.StoreRegion>()
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

    return countryCode
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a NEXT_PUBLIC_MEDUSA_BACKEND_URL environment variable."
      )
    }
  }
}

/**
 * Middleware to handle region selection and onboarding status.
 */
export async function middleware(request: NextRequest) {
  try {
    let redirectUrl = request.nextUrl.href

    let response = NextResponse.redirect(redirectUrl, 307)

    let cacheIdCookie = request.cookies.get("_medusa_cache_id")

    let cacheId = cacheIdCookie?.value || crypto.randomUUID()

    const regionMap = await getRegionMap(cacheId)
    const isRegionMapEmpty = !regionMap || regionMap.size === 0

    // If region map is empty (backend fetch failed), use fallback logic
    if (isRegionMapEmpty) {
      const pathSegments = request.nextUrl.pathname.split("/").filter(Boolean)
      const firstSegment = pathSegments[0]?.toLowerCase()

      // If URL already has a 2-letter country code, accept it and continue
      if (firstSegment && firstSegment.length === 2) {
        const response = NextResponse.next()
        response.cookies.set("_medusa_cache_id", cacheId, {
          maxAge: 60 * 60 * 24,
        })
        return response
      }

      // Otherwise, redirect to default country code
      const fallbackCountry = DEFAULT_REGION || "dk"
      const redirectPath =
        request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname
      const queryString = request.nextUrl.search ? request.nextUrl.search : ""
      redirectUrl = `${request.nextUrl.origin}/${fallbackCountry}${redirectPath}${queryString}`
      response = NextResponse.redirect(`${redirectUrl}`, 307)
      response.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
      })
      return response
    }

    // Normal flow when regions are available
    const countryCode = regionMap && (await getCountryCode(request, regionMap))

    const urlHasCountryCode =
      countryCode &&
      request.nextUrl.pathname.split("/")[1]?.toLowerCase() ===
        countryCode.toLowerCase()

    // if one of the country codes is in the url and the cache id is set, return next
    if (urlHasCountryCode && cacheIdCookie) {
      return NextResponse.next()
    }

    // if one of the country codes is in the url and the cache id is not set, set the cache id and redirect
    if (urlHasCountryCode && !cacheIdCookie) {
      response.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
      })

      return response
    }

    // check if the url is a static asset
    if (request.nextUrl.pathname.includes(".")) {
      return NextResponse.next()
    }

    const redirectPath =
      request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname

    const queryString = request.nextUrl.search ? request.nextUrl.search : ""

    // If no country code is set, we redirect to the relevant region.
    if (!urlHasCountryCode && countryCode) {
      redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`
      response = NextResponse.redirect(`${redirectUrl}`, 307)
    } else if (!urlHasCountryCode && !countryCode) {
      // Handle case where no valid country code exists (empty regions)
      // Fallback to default country code if regions fetch failed
      const fallbackCountry = DEFAULT_REGION || "dk"
      redirectUrl = `${request.nextUrl.origin}/${fallbackCountry}${redirectPath}${queryString}`
      response = NextResponse.redirect(`${redirectUrl}`, 307)
      response.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
      })
    }

    return response
  } catch (error) {
    // Log error for debugging
    console.error("Middleware error:", error)

    // If it's a regions error, return a helpful message
    if (error instanceof Error && error.message.includes("regions")) {
      return new NextResponse(
        JSON.stringify({
          error: error.message,
          hint: "Please ensure regions are configured in your Medusa Admin and the backend is accessible.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // For other errors, return generic error
    return new NextResponse(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
