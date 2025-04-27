import { FindParams, HttpTypes, SelectParams } from "@medusajs/types"
import {
    QueryKey,
    useQuery,
    UseQueryResult,
} from "@tanstack/react-query"

import { storeKeys } from "../query-keys"
import { UseQueryOptionsWrapper } from "../types"
import { useMedusa } from "../use-medusa"

/**
 * Hook retrieves a list of product collections.
 *
 * @param {FindParams & HttpTypes.StoreCollectionFilters} query - Filters and pagination configurations.
 * @param {UseQueryOptionsWrapper<HttpTypes.StoreCollectionListResponse, Error, QueryKey>} options - Query options.
 * @returns {UseQueryResult<HttpTypes.StoreCollectionListResponse, Error>} Query result.
 */
export const useCollections = (
  query?: FindParams & HttpTypes.StoreCollectionFilters,
  options?: UseQueryOptionsWrapper<
    HttpTypes.StoreCollectionListResponse,
    Error,
    ReturnType<typeof storeKeys.collections.list>
  >
): UseQueryResult<HttpTypes.StoreCollectionListResponse, Error> => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: storeKeys.collections.list(query),
    queryFn: () => client.store.collection.list(query),
    ...options,
  })

  return { ...data, ...rest } as UseQueryResult<HttpTypes.StoreCollectionListResponse, Error>;
}

/**
 * Hook retrieves a specific product collection by its ID.
 *
 * @param {string} id - The collection's ID.
 * @param {SelectParams} query - Configure the fields to retrieve.
 * @param {UseQueryOptionsWrapper<HttpTypes.StoreCollectionResponse, Error, QueryKey>} options - Query options.
 * @returns {UseQueryResult<HttpTypes.StoreCollectionResponse, Error>} Query result.
 */
export const useCollection = (
  id: string,
  query?: SelectParams,
  options?: UseQueryOptionsWrapper<
    HttpTypes.StoreCollectionResponse,
    Error,
    ReturnType<typeof storeKeys.collections.detail>
  >
): UseQueryResult<HttpTypes.StoreCollectionResponse, Error> => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: storeKeys.collections.detail(id, query),
    queryFn: () => client.store.collection.retrieve(id, query),
    enabled: !!id,
    ...options,
  })

  return { ...data, ...rest } as UseQueryResult<HttpTypes.StoreCollectionResponse, Error>;
} 