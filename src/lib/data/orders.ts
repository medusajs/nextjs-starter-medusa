"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { cache } from "react"
import { getAuthHeaders } from "./cookies"

export const retrieveOrder = cache(async function (id: string) {
  return sdk.store.order
    .retrieve(
      id,
      { fields: "*payment_collections.payments" },
      { next: { tags: ["order"] }, ...getAuthHeaders() }
    )
    .then(({ order }) => order)
    .catch((err) => medusaError(err))
})

export const listOrders = cache(async function (
  limit: number = 10,
  offset: number = 0
) {
  return sdk.store.order
    .list({ limit, offset }, { next: { tags: ["order"] }, ...getAuthHeaders() })
    .then(({ orders }) => orders)
    .catch((err) => medusaError(err))
})

export const createTransferRequest = async (
  state: { success: boolean; error: string | null },
  formData: FormData
): Promise<{ success: boolean; error: string | null }> => {
  console.log(formData)
  return { success: true, error: "No good" }
}

export const acceptTransferRequest = async (formData: FormData) => {
  console.log(formData)
}

export const rejectTransferRequest = async (formData: FormData) => {
  console.log(formData)
}
