"use server"

import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

import { retrieveRegion } from "@lib/data"

import { updateCartRegion } from "@modules/cart/actions"

/**
 * Retrieves the region based on the regionId cookie
 */
export async function getRegion() {
  const regionCookie = cookies().get("region")?.value

  if (!regionCookie) {
    console.log("No region cookie")
    return null
  }

  const { regionId } = JSON.parse(regionCookie)

  if (!regionId) {
    console.log("No region ID")
    return null
  }

  try {
    const region = await retrieveRegion(regionId).then((region) => region)
    return region
  } catch (e: any) {
    console.log(e.toString())
    return null
  }
}

/**
 * Updates the regionId cookie and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(regionId: string, countryCode: string) {
  cookies().set("region", JSON.stringify({ regionId, countryCode }))
  revalidateTag("regions")
  await updateCartRegion(regionId)
}
