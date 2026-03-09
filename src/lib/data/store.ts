"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

type StoreResponse = {
  store: {
    id: string
    name?: string | null
  }
}

export const retrieveStore = async () => {
  const next = {
    ...(await getCacheOptions("store")),
  }

  return sdk.client
    .fetch<StoreResponse>("/store/site", {
      next,
      cache: "force-cache",
    })
    .then(({ store }) => store)
    .catch(() => null)
}
