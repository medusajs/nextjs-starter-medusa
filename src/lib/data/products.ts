import { newClient } from "@lib/config"
import { StoreGetProductsParams } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { cache } from "react"
import { getRegion } from "./regions"

export const getProductsById = cache(async function ({
  ids,
  currencyCode,
}: {
  ids: string[]
  currencyCode: string
}) {
  return newClient.store.product
    .list(
      {
        id: ids,
        currency_code: currencyCode,
        fields: "*variants.calculated_price",
      },
      { next: { tags: ["products"] } }
    )
    .then(({ products }) => products)
})

export const getProductByHandle = cache(async function (
  handle: string,
  regionId: string
): Promise<PricedProduct> {
  return newClient.store.product
    .list(
      {
        handle,
        region_id: regionId,
        fields: "*variants.calculated_price",
      },
      { next: { tags: ["products"] } }
    )
    .then(({ products }) => products[0])
})

export const getProductsList = cache(async function ({
  pageParam = 1,
  queryParams,
  countryCode,
}: {
  pageParam?: number
  queryParams?: StoreGetProductsParams
  countryCode: string
}): Promise<{
  response: { products: PricedProduct[]; count: number }
  nextPage: number | null
  queryParams?: StoreGetProductsParams
}> {
  const limit = queryParams?.limit || 12
  const offset = (pageParam - 1) * limit
  const region = await getRegion(countryCode)

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }
  return newClient.store.product
    .list(
      {
        limit,
        offset,
        region_id: region.id,
        fields: "*variants.calculated_price",
        ...queryParams,
      },
      { next: { tags: ["products"] } }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
})
