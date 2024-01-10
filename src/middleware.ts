import { Region } from "@medusajs/medusa"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const DEFAULT_REGION = "us"

/**
 * Fetches regions from Medusa and sets the region cookie.
 * @param request
 * @param response
 */
async function fetchAndSetRegionCookie(
  request: NextRequest,
  response: NextResponse
) {
  try {
    // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
    const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
      next: {
        revalidate: 3600,
        tags: ["regions"],
      },
    }).then((res) => res.json())

    // Create a map of country codes to region IDs.
    const regionMap = new Map<string, string>()

    regions.forEach((region: Region) => {
      region.countries.forEach((c) => {
        regionMap.set(c.iso_2, region.id)
      })
    })

    // Set the region cookie based on the x-vercel-ip-country header.
    // If the header is not present, we'll use the default region which is defined at the top of this file.
    let regionId = regionMap.get(DEFAULT_REGION)
    let countryCode = DEFAULT_REGION

    const vercelCountry = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    if (vercelCountry && regionMap.has(vercelCountry)) {
      regionId = regionMap.get(vercelCountry)
      countryCode = vercelCountry
    }

    regionId &&
      response.cookies.set(
        "_medusa_region",
        JSON.stringify({ regionId, countryCode })
      )
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a NEXT_PUBLIC_MEDUSA_BACKEND_URL environment variable?"
      )
    }
  }
}

/**
 * Middleware to handle region selection and onboarding status.
 */
export async function middleware(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const isOnboarding = searchParams.get("onboarding")
  const regionCookie = request.cookies.get("_medusa_region")?.value
  const onboardingCookie = request.cookies.get("_medusa_onboarding")?.value

  // If we have a region cookie and we're not onboarding, we can skip this middleware entirely.
  if (regionCookie && (!isOnboarding || onboardingCookie))
    return NextResponse.next()

  // Create a response object that we'll use to set cookies and redirect.
  const response = NextResponse.redirect(request.url, 307)

  // If we're onboarding, we'll set a cookie to indicate that we're onboarding.
  if (isOnboarding)
    response.cookies.set("_medusa_onboarding", "true", { maxAge: 60 * 60 * 24 })

  // If we have a region cookie, we can skip fetching regions from Medusa and return the response.
  if (regionCookie) return response

  // If we don't have a region cookie, we'll fetch regions from Medusa and set the region cookie.
  await fetchAndSetRegionCookie(request, response)

  // Return the response. This will redirect the user to the same URL but with all relevant cookies set.
  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
}
