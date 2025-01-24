import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

import createIntlMiddleware from "next-intl/middleware"
import { fallbackLng, languages } from "./lib/i18n/settings"
const intlMiddleware = createIntlMiddleware({
  locales: languages,
  defaultLocale: fallbackLng,
  localeDetection: true,
})

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

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
  regionMap: Map<string, HttpTypes.StoreRegion | number>,
  countryCodePathnameIndex: number
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

      console.log({ pna: request.nextUrl.pathname.split("/") })
      const urlCountryCode = request.nextUrl.pathname
        .split("/")
        [countryCodePathnameIndex]?.toLowerCase()

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
        "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL."
      )
    }
  }
}

/**
 * Middleware to handle region selection and onboarding status.
 */
export async function middleware(request: NextRequest) {
  let redirectUrl = request.nextUrl.href

  let response = NextResponse.redirect(redirectUrl, 307)

  const pathnameArr = request.nextUrl.pathname.split("/");
  const urlHasKnownLocale = languages.includes(pathnameArr[1]);
  
  // need to redirect manually if we provide a wrong locale when a countryCode is included
  const urlHasUnknownLocale =
    !urlHasKnownLocale &&
    pathnameArr[1].length == 2 &&
    (pathnameArr?.[2] ? pathnameArr[2].length == 2 : true);
  

  const redirectPath =
      request.nextUrl.pathname === "/"
      ? ""
      : urlHasKnownLocale || urlHasUnknownLocale
      ? pathnameArr.slice(2).join("/")
      : request.nextUrl.pathname

      
  const queryString = request.nextUrl.search ? request.nextUrl.search : ""

  if (urlHasUnknownLocale) {
    redirectUrl = `${request.nextUrl.origin}/${fallbackLng}/${redirectPath}${queryString}`
    console.log("urlHasUnknownLocale", { redirectUrl })
    response = NextResponse.redirect(`${redirectUrl}`, 307)
  }

  let cacheIdCookie = request.cookies.get("_medusa_cache_id");

  let cacheId = cacheIdCookie?.value || crypto.randomUUID();
  
  const regionMap = await getRegionMap(cacheId);
  
  const countryCodePathnameIndex = urlHasKnownLocale ? 2 : 1;
  
  const countryCode =
    regionMap &&
    (await getCountryCode(request, regionMap, countryCodePathnameIndex));
  

  const urlHasCountryCode =
    countryCode &&
    request.nextUrl.pathname.split("/")[countryCodePathnameIndex] == countryCode

  // if one of the country codes is in the url and the cache id is set, return next
  if (!urlHasUnknownLocale && urlHasCountryCode && cacheIdCookie) {
    return intlMiddleware(request)
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

  // If no country code is set, we redirect to the relevant region.
  if (!urlHasCountryCode && countryCode) {
    redirectUrl = `${request.nextUrl.origin}/${
      urlHasKnownLocale ? pathnameArr[1] + "/" : ""
    }${countryCode}/${redirectPath}${queryString}`
    console.log("urlHasCountryCode", { redirectUrl })
    response = NextResponse.redirect(`${redirectUrl}`, 307)
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
