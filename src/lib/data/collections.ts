"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const retrieveCollection = async (id: string) => {
  try {
    const next = {
      ...(await getCacheOptions("collections")),
    }

    return await sdk.client
      .fetch<{ collection: HttpTypes.StoreCollection }>(
        `/store/collections/${id}`,
        {
          next,
          cache: "force-cache",
        }
      )
      .then(({ collection }) => collection)
      .catch((error) => {
        console.warn(`Failed to fetch collection ${id}:`, error)
        return null
      })
  } catch (error) {
    console.warn(`Failed to fetch collection ${id}:`, error)
    return null
  }
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  try {
    const next = {
      ...(await getCacheOptions("collections")),
    }

    queryParams.limit = queryParams.limit || "100"
    queryParams.offset = queryParams.offset || "0"

    return await sdk.client
      .fetch<{ collections: HttpTypes.StoreCollection[]; count: number }>(
        "/store/collections",
        {
          query: queryParams,
          next,
          cache: "force-cache",
        }
      )
      .then(({ collections }) => ({ collections, count: collections.length }))
      .catch((error) => {
        console.warn("Failed to fetch collections:", error)
        return { collections: [], count: 0 }
      })
  } catch (error) {
    console.warn("Failed to fetch collections:", error)
    return { collections: [], count: 0 }
  }
}

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection | null> => {
  try {
    const next = {
      ...(await getCacheOptions("collections")),
    }

    return await sdk.client
      .fetch<HttpTypes.StoreCollectionListResponse>(`/store/collections`, {
        query: { handle, fields: "*products" },
        next,
        cache: "force-cache",
      })
      .then(({ collections }) => collections[0] || null)
      .catch((error) => {
        console.warn(`Failed to fetch collection by handle ${handle}:`, error)
        return null
      })
  } catch (error) {
    console.warn(`Failed to fetch collection by handle ${handle}:`, error)
    return null
  }
}
