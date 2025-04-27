import { HttpTypes } from "@medusajs/types"
import { QueryKey, useQuery, UseQueryResult } from "@tanstack/react-query"

import { storeKeys } from "../query-keys"
import { UseQueryOptionsWrapper } from "../types"
import { useMedusa } from "../use-medusa"

/**
 * Hook retrieves a list of products.
 *
 * @param {HttpTypes.StoreProductListParams} query - Filters and pagination configurations.
 * @param {UseQueryOptionsWrapper<HttpTypes.StoreProductListResponse, Error, QueryKey>} options - Query options.
 * @returns {UseQueryResult<HttpTypes.StoreProductListResponse, Error>} Query result.
 */
export const useProducts = (
  query?: HttpTypes.StoreProductParams,
  options?: UseQueryOptionsWrapper<
    HttpTypes.StoreProductListResponse,
    Error,
    ReturnType<typeof storeKeys.products.list>
  >
): UseQueryResult<HttpTypes.StoreProductListResponse, Error> => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: storeKeys.products.list(query),
    queryFn: () => client.store.product.list(query),
    ...options,
  })

  return { ...data, ...rest } as UseQueryResult<
    HttpTypes.StoreProductListResponse,
    Error
  >
}

/**
 * Hook retrieves a specific product by its ID.
 *
 * @param {string} id - The product's ID.
 * @param {HttpTypes.StoreProductParams} query - Configure the fields to retrieve.
 * @param {UseQueryOptionsWrapper<HttpTypes.StoreProductResponse, Error, QueryKey>} options - Query options.
 * @returns {UseQueryResult<HttpTypes.StoreProductResponse, Error>} Query result.
 */
export const useProduct = (
  id: string,
  query?: HttpTypes.StoreProductParams,
  options?: UseQueryOptionsWrapper<
    HttpTypes.StoreProductResponse,
    Error,
    ReturnType<typeof storeKeys.products.detail>
  >
): UseQueryResult<HttpTypes.StoreProductResponse, Error> => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: storeKeys.products.detail(id, query),
    queryFn: () => client.store.product.retrieve(id, query),
    enabled: !!id,
    ...options,
  })

  return { ...data, ...rest } as UseQueryResult<
    HttpTypes.StoreProductResponse,
    Error
  >
}
