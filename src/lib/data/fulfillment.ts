import { newClient } from "@lib/config"
import { cache } from "react"

// Shipping actions
export const listCartShippingMethods = cache(async function (cartId: string) {
  return newClient.store.fulfillment
    .listCartOptions(cartId, { next: { tags: ["shipping"] } })
    .then(({ shipping_options }) => shipping_options)
    .catch(() => {
      return null
    })
})
