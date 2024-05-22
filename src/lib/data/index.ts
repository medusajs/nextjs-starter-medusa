import {
  StorePostAuthReq,
  StorePostCustomersCustomerAddressesAddressReq,
  StorePostCustomersCustomerAddressesReq,
  StorePostCustomersCustomerReq,
  StorePostCustomersReq,
} from "@medusajs/medusa"
import { cache } from "react"

import { cookies } from "next/headers"

/**
 * Function for getting custom headers for Medusa API requests, including the JWT token and cache revalidation tags.
 *
 * @param tags
 * @returns custom headers for Medusa API requests
 */
const getMedusaHeaders = (tags: string[] = []) => {
  const headers = {
    next: {
      tags,
    },
  } as Record<string, any>

  const token = cookies().get("_medusa_jwt")?.value

  if (token) {
    headers.authorization = `Bearer ${token}`
  } else {
    headers.authorization = ""
  }

  return headers
}

// Authentication actions
export async function getToken(credentials: StorePostAuthReq): Promise<any> {
  // return medusaClient.auth
  //   .getToken(credentials, {
  //     next: {
  //       tags: ["auth"],
  //     },
  //   })
  //   .then(({ access_token }) => {
  //     access_token &&
  //       cookies().set("_medusa_jwt", access_token, {
  //         maxAge: 60 * 60 * 24 * 7,
  //         httpOnly: true,
  //         sameSite: "strict",
  //         secure: process.env.NODE_ENV === "production",
  //       })
  //     return access_token
  //   })
  //   .catch((err) => {
  //     throw new Error("Wrong email or password.")
  //   })
}

export async function authenticate(
  credentials: StorePostAuthReq
): Promise<any> {
  // const headers = getMedusaHeaders(["auth"])
  // return medusaClient.auth
  //   .authenticate(credentials, headers)
  //   .then(({ customer }) => customer)
  //   .catch((err) => medusaError(err))
}

export const getSession = cache(async function getSession(): Promise<any> {
  // const headers = getMedusaHeaders(["auth"])
  // return medusaClient.auth
  //   .getSession(headers)
  //   .then(({ customer }) => customer)
  //   .catch((err) => medusaError(err))
})

// Customer actions
export async function getCustomer(): Promise<any> {
  // const headers = getMedusaHeaders(["customer"])
  // return medusaClient.customers
  //   .retrieve(headers)
  //   .then(({ customer }) => customer)
  //   .catch((err) => null)
}

export async function createCustomer(
  data: StorePostCustomersReq
): Promise<any> {
  // const headers = getMedusaHeaders(["customer"])
  // return medusaClient.customers
  //   .create(data, headers)
  //   .then(({ customer }) => customer)
  //   .catch((err) => medusaError(err))
}

export async function updateCustomer(
  data: StorePostCustomersCustomerReq
): Promise<any> {
  // const headers = getMedusaHeaders(["customer"])
  // return medusaClient.customers
  //   .update(data, headers)
  //   .then(({ customer }) => customer)
  //   .catch((err) => medusaError(err))
}

export async function addShippingAddress(
  data: StorePostCustomersCustomerAddressesReq
): Promise<any> {
  // const headers = getMedusaHeaders(["customer"])
  // return medusaClient.customers.addresses
  //   .addAddress(data, headers)
  //   .then(({ customer }) => customer)
  //   .catch((err) => medusaError(err))
}

export async function deleteShippingAddress(addressId: string): Promise<any> {
  // const headers = getMedusaHeaders(["customer"])
  // return medusaClient.customers.addresses
  //   .deleteAddress(addressId, headers)
  //   .then(({ customer }) => customer)
  //   .catch((err) => medusaError(err))
}

export async function updateShippingAddress(
  addressId: string,
  data: StorePostCustomersCustomerAddressesAddressReq
): Promise<any> {
  // const headers = getMedusaHeaders(["customer"])
  // return medusaClient.customers.addresses
  //   .updateAddress(addressId, data, headers)
  //   .then(({ customer }) => customer)
  //   .catch((err) => medusaError(err))
}

export const listCustomerOrders = cache(async function (
  limit: number = 10,
  offset: number = 0
): Promise<any> {
  // const headers = getMedusaHeaders(["customer"])
  // return medusaClient.customers
  //   .listOrders({ limit, offset }, headers)
  //   .then(({ orders }) => orders)
  //   .catch((err) => medusaError(err)) as any
})
