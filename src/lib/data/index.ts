import medusaRequest from "../medusa-fetch"
import { StoreGetProductsParams } from "@medusajs/medusa"

/**
 * This file contains functions for fetching products and collections from the Medusa API or the Medusa Product Module,
 * depending on the feature flag. By default, the standard Medusa API is used. To use the Medusa Product Module, set the feature flag to true.
 */

// The feature flag is set in the store.config.json file. Restart the server after changing the flag for the changes to take effect.
const PRODUCT_MODULE_ENABLED =
  process.env.FEATURE_PRODUCTMODULE_ENABLED || false

// The API_BASE_URL is set in the .env file. It is the base URL of your Next.js app.
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"

// Set DEBUG to true to console.log where the data is coming from.
const DEBUG = false

/**
 * Fetches a product by handle, using the Medusa API or the Medusa Product Module, depending on the feature flag.
 * @param handle (string) - The handle of the product to retrieve
 * @returns (array) - An array of products (should only be one)
 */
export async function getProductByHandle(handle: string) {
  if (PRODUCT_MODULE_ENABLED) {
    DEBUG && console.log("PRODUCT_MODULE_ENABLED")
    const data = await fetch(`${API_BASE_URL}/api/products/${handle}`)
      .then((res) => res.json())
      .catch((err) => {
        throw err
      })

    return data
  }

  DEBUG && console.log("PRODUCT_MODULE_DISABLED")
  const { products } = await medusaRequest("GET", "/products", {
    query: {
      handle,
    },
  })
    .then((res) => res.body)
    .catch((err) => {
      throw err
    })

  return {
    products,
  }
}

/**
 * Fetches a list of products, using the Medusa API or the Medusa Product Module, depending on the feature flag.
 * @param pageParam (number) - The offset of the products to retrieve
 * @param queryParams (object) - The query parameters to pass to the API
 * @returns 'response' (object) - An object containing the products and the next page offset
 * @returns 'nextPage' (number) - The offset of the next page of products
 */
export async function getProductsList({
  pageParam = 0,
  queryParams,
}: {
  pageParam?: number
  queryParams: StoreGetProductsParams
}) {
  const limit = queryParams.limit || 12

  if (PRODUCT_MODULE_ENABLED) {
    console.log("PRODUCT_MODULE_ENABLED")
    const params = new URLSearchParams(queryParams as Record<string, string>)

    const { products, count, nextPage } = await fetch(
      `${API_BASE_URL}/api/products?limit=${limit}&offset=${pageParam}&${params.toString()}`,
      {
        next: {
          tags: ["products"],
        },
      }
    ).then((res) => res.json())

    return {
      response: { products, count },
      nextPage,
    }
  }

  DEBUG && console.log("PRODUCT_MODULE_DISABLED")
  const { products, count, nextPage } = await medusaRequest(
    "GET",
    "/products",
    {
      query: {
        limit,
        offset: pageParam,
        ...queryParams,
      },
    }
  )
    .then((res) => res.body)
    .catch((err) => {
      throw err
    })

  return {
    response: { products, count },
    nextPage,
  }
}

/**
 * Fetches a list of collections, using the Medusa API or the Medusa Product Module, depending on the feature flag.
 * @param offset (number) - The offset of the collections to retrieve (default: 0
 * @returns collections (array) - An array of collections
 * @returns count (number) - The total number of collections
 */
export async function getCollectionsList(offset: number = 0) {
  if (PRODUCT_MODULE_ENABLED) {
    DEBUG && console.log("PRODUCT_MODULE_ENABLED")
    const { collections, count } = await fetch(
      `${API_BASE_URL}/api/collections?offset=${offset}`,
      {
        next: {
          tags: ["collections"],
        },
      }
    )
      .then((res) => res.json())
      .catch((err) => {
        throw err
      })

    return {
      collections,
      count,
    }
  }

  DEBUG && console.log("PRODUCT_MODULE_DISABLED")
  const { collections, count } = await medusaRequest("GET", "/collections", {
    query: {
      offset,
    },
  })
    .then((res) => res.body)
    .catch((err) => {
      throw err
    })

  return {
    collections,
    count,
  }
}

/**
 * Fetches a collection by handle, using the Medusa API or the Medusa Product Module, depending on the feature flag.
 * @param handle  (string) - The handle of the collection to retrieve
 * @returns collections (array) - An array of collections (should only be one)
 * @returns response (object) - An object containing the products and the number of products in the collection
 * @returns nextPage (number) - The offset of the next page of products
 */
export async function getCollectionByHandle(handle: string) {
  if (PRODUCT_MODULE_ENABLED) {
    DEBUG && console.log("PRODUCT_MODULE_ENABLED")
    const data = await fetch(`${API_BASE_URL}/api/collections/${handle}`)
      .then((res) => res.json())
      .catch((err) => {
        throw err
      })

    return data
  }

  DEBUG && console.log("PRODUCT_MODULE_DISABLED")
  const data = await medusaRequest("GET", "/collections", {
    query: {
      handle: [handle],
    },
  })
    .then((res) => res.body)
    .catch((err) => {
      throw err
    })

  return data
}

/**
 * Fetches a list of products in a collection, using the Medusa API or the Medusa Product Module, depending on the feature flag.
 * @param pageParam (number) - The offset of the products to retrieve
 * @param handle (string) - The handle of the collection to retrieve
 * @param cartId (string) - The ID of the cart
 * @returns response (object) - An object containing the products and the number of products in the collection
 * @returns nextPage (number) - The offset of the next page of products
 */
export async function getProductsByCollectionHandle({
  pageParam = 0,
  handle,
  cartId,
}: {
  pageParam?: number
  handle: string
  cartId?: string
}) {
  if (PRODUCT_MODULE_ENABLED) {
    DEBUG && console.log("PRODUCT_MODULE_ENABLED")
    const { response, nextPage } = await fetch(
      `${API_BASE_URL}/api/collections/${handle}?cart_id=${cartId}&page=${pageParam.toString()}`
    )
      .then((res) => res.json())
      .catch((err) => {
        throw err
      })

    return {
      response,
      nextPage,
    }
  }

  DEBUG && console.log("PRODUCT_MODULE_DISABLED")
  const { id } = await getCollectionByHandle(handle).then(
    (res) => res.collections[0]
  )

  const { response, nextPage } = await getProductsList({
    pageParam,
    queryParams: { collection_id: [id], cart_id: cartId },
  })
    .then((res) => res)
    .catch((err) => {
      throw err
    })

  return {
    response,
    nextPage,
  }
}
