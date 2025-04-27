import { FindParams, HttpTypes } from "@medusajs/types"
import {
    QueryKey,
    useQuery,
    UseQueryResult,
} from "@tanstack/react-query"

import { storeKeys } from "../query-keys"
import { UseQueryOptionsWrapper } from "../types"
import { useMedusa } from "../use-medusa"

/**
 * Hook retrieves a list of product categories.
 *
 * @param {FindParams & HttpTypes.StoreProductCategoryListParams} query - Filters and pagination configurations.
 * @param {UseQueryOptionsWrapper<HttpTypes.StoreProductCategoryListResponse, Error, QueryKey>} options - Query options.
 * @returns {UseQueryResult<HttpTypes.StoreProductCategoryListResponse, Error>} Query result.
 */
export const useCategories = (
  query?: FindParams & HttpTypes.StoreProductCategoryListParams,
  options?: UseQueryOptionsWrapper<
    HttpTypes.StoreProductCategoryListResponse,
    Error,
    ReturnType<typeof storeKeys.categories.list>
  >
): UseQueryResult<HttpTypes.StoreProductCategoryListResponse, Error> => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: storeKeys.categories.list(query),
    queryFn: () => client.store.category.list(query),
    ...options,
  })

  return { ...data, ...rest } as UseQueryResult<HttpTypes.StoreProductCategoryListResponse, Error>;
}

/**
 * Hook retrieves a specific product category by its ID.
 *
 * @param {string} id - The category's ID.
 * @param {HttpTypes.StoreProductCategoryParams} query - Configure the fields to retrieve.
 * @param {UseQueryOptionsWrapper<HttpTypes.StoreProductCategoryResponse, Error, QueryKey>} options - Query options.
 * @returns {UseQueryResult<HttpTypes.StoreProductCategoryResponse, Error>} Query result.
 */
export const useCategory = (
  id: string,
  query?: HttpTypes.StoreProductCategoryParams,
  options?: UseQueryOptionsWrapper<
    HttpTypes.StoreProductCategoryResponse,
    Error,
    ReturnType<typeof storeKeys.categories.detail>
  >
): UseQueryResult<HttpTypes.StoreProductCategoryResponse, Error> => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: storeKeys.categories.detail(id, query),
    queryFn: () => client.store.category.retrieve(id, query),
    enabled: !!id,
    ...options,
  })

  return { ...data, ...rest } as UseQueryResult<HttpTypes.StoreProductCategoryResponse, Error>;
} 