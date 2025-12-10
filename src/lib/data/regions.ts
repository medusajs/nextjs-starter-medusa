"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listRegions = async () => {
  try {
    const next = {
      ...(await getCacheOptions("regions")),
    }

    return await sdk.client
      .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
        method: "GET",
        next,
        cache: "force-cache",
      })
      .then(({ regions }) => regions)
      .catch((error) => {
        // Handle Cloudflare 1003 errors gracefully
        console.warn("Failed to fetch regions in Server Component:", error)
        return []
      })
  } catch (error) {
    console.warn("Failed to fetch regions in Server Component:", error)
    return []
  }
}

export const retrieveRegion = async (id: string) => {
  try {
    const next = {
      ...(await getCacheOptions(["regions", id].join("-"))),
    }

    return await sdk.client
      .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
        method: "GET",
        next,
        cache: "force-cache",
      })
      .then(({ region }) => region)
      .catch((error) => {
        // Handle Cloudflare 1003 errors gracefully
        console.warn(`Failed to fetch region ${id}:`, error)
        return null
      })
  } catch (error) {
    console.warn(`Failed to fetch region ${id}:`, error)
    return null
  }
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = async (countryCode: string) => {
  try {
    if (regionMap.has(countryCode)) {
      return regionMap.get(countryCode)
    }

    const regions = await listRegions()

    if (!regions) {
      return null
    }

    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        regionMap.set(c?.iso_2 ?? "", region)
      })
    })

    const region = countryCode
      ? regionMap.get(countryCode)
      : regionMap.get("us")

    return region
  } catch (e: any) {
    return null
  }
}
