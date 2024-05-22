import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { cache } from "react"

export const retrieveOrder = cache(async function (id: string) {
  return sdk.store.order
    .retrieve(id, {}, { next: { tags: ["order"] } })
    .then(({ order }) => order)
    .catch((err) => medusaError(err))
})
