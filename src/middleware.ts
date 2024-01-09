import { Region } from "@medusajs/medusa"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const DEFAULT_REGION = "us"

const regionMap = new Map<string, string>()

export async function middleware(request: NextRequest) {
  const regionCookie = request.cookies.get("region")?.value

  if (regionCookie) return NextResponse.next()

  const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
    next: {
      revalidate: 3600,
      tags: ["regions"],
    },
  }).then((res) => res.json())

  regions.forEach((region: Region) => {
    const countries = region.countries.map((c) => c.iso_2)
    countries.forEach((c) => {
      regionMap.set(c, region.id)
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
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|favicon.ico).*)",
  ],
}
