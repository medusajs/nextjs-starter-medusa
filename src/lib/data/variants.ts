"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

import { getAuthHeaders, getCacheOptions } from "./cookies"

export const retrieveVariant = async (
  variant_id: string
): Promise<HttpTypes.StoreProductVariant | null> => {
  const authHeaders = await getAuthHeaders()

  if (!authHeaders) return null

  const headers = {
    ...authHeaders,
  }

  const disableCache = process.env.NODE_ENV !== "production"
  const next = disableCache
    ? undefined
    : {
        ...(await getCacheOptions("variants")),
      }

  return await sdk.client
    .fetch<{ variant: HttpTypes.StoreProductVariant }>(
      `/store/product-variants/${variant_id}`,
      {
        method: "GET",
        query: {
          fields: "*images",
        },
        headers,
        next,
        cache: disableCache ? "no-store" : "force-cache",
      }
    )
    .then(({ variant }) => variant)
    .catch(() => null)
}
