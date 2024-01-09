import { Region } from "@medusajs/medusa"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const DEFAULT_REGION = "us"

const regionMap = new Map<string, string>()

export async function middleware(request: NextRequest) {
  if (request.cookies.get("region")?.value) return NextResponse.next()

  try {
    // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
    const res = await fetch(`${BACKEND_URL}/store/regions`, {
      next: {
        revalidate: 3600,
        tags: ["regions"],
      },
    })
    const { regions } = await res.json()

    regions.forEach((region: Region) => {
      region.countries.forEach((c) => {
        regionMap.set(c.iso_2, region.id)
      })
    })

    let regionId = regionMap.get(DEFAULT_REGION)
    let countryCode = DEFAULT_REGION

    const vercelCountry = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    if (vercelCountry && regionMap.has(vercelCountry)) {
      regionId = regionMap.get(vercelCountry)
      countryCode = vercelCountry
    }

    const response = NextResponse.redirect(request.url, 307)

    regionId &&
      response.cookies.set("region", JSON.stringify({ regionId, countryCode }))

    return response
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a NEXT_PUBLIC_MEDUSA_BACKEND_URL environment variable?"
      )
    }

    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
}
