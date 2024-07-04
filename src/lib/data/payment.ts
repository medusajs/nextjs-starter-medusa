import { sdk } from "@lib/config"

// Shipping actions
export const listCartPaymentMethods = async function (regionId: string) {
  return sdk.store.payment
    .listPaymentProviders(
      { region_id: regionId },
      { next: { tags: ["payment_providers"] } }
    )
    .then(({ payment_providers }) => payment_providers)
    .catch(() => {
      return null
    })
}
