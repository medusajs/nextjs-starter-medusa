import { newClient } from "@lib/config"
import { ProductCollection } from "@medusajs/medusa"
import { cache } from "react"

export const retrieveCollection = cache(async function (id: string) {
  return newClient.store.collection
    .retrieve(id, {}, { next: { tags: ["collections"] } })
    .then(({ collection }) => collection)
})

export const getCollectionsList = cache(async function (
  offset: number = 0,
  limit: number = 100
): Promise<{ collections: ProductCollection[]; count: number }> {
  return newClient.store.collection
    .list({ limit, offset: -1 }, { next: { tags: ["collections"] } })
    .then(({ collections }) => ({ collections, count: collections.length }))
})

export const getCollectionByHandle = cache(async function (
  handle: string
): Promise<ProductCollection> {
  return newClient.store.collection
    .list({ handle }, { next: { tags: ["collections"] } })
    .then(({ collections }) => collections[0])
})
