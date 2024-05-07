import { newClient } from "@lib/config"
import { ProductCollection } from "@medusajs/medusa"
import { cache } from "react"
import { ProductCollectionWithPreviews } from "types/global"
import { getProductsList } from "./products"

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

export const getCollectionsWithProducts = cache(
  async (
    countryCode: string
  ): Promise<ProductCollectionWithPreviews[] | null> => {
    const { collections } = await getCollectionsList(0, 3)

    if (!collections) {
      return null
    }

    const collectionIds = collections.map((collection) => collection.id)

    const { response } = await getProductsList({
      queryParams: { collection_id: collectionIds },
      countryCode,
    })

    response.products.forEach((product) => {
      const collection = collections.find(
        (collection) => collection.id === product.collection_id
      )

      if (collection) {
        if (!collection.products) {
          collection.products = []
        }

        collection.products.push(product as any)
      }
    })

    return collections as unknown as ProductCollectionWithPreviews[]
  }
)
