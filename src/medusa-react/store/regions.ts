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
 * Hook retrieves a list of regions.
 *
 * @param {FindParams & HttpTypes.StoreRegionFilters} query - Filters and pagination configurations.
 * @param {UseQueryOptionsWrapper<HttpTypes.StoreRegionListResponse, Error, QueryKey>} options - Query options.
 * @returns {UseQueryResult<HttpTypes.StoreRegionListResponse, Error>} Query result.
 */
export const useRegions = (
  query?: FindParams & HttpTypes.StoreRegionFilters,
  options?: UseQueryOptionsWrapper<
    HttpTypes.StoreRegionListResponse,
    Error,
    ReturnType<typeof storeKeys.regions.list>
  >
): UseQueryResult<HttpTypes.StoreRegionListResponse, Error> => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: storeKeys.regions.list(query),
    queryFn: () => client.store.region.list(query),
    ...options,
  })

  return { ...data, ...rest } as UseQueryResult<HttpTypes.StoreRegionListResponse, Error>;
}

/**
 * Hook retrieves a specific region by its ID.
 *
 * @param {string} id - The region's ID.
 * @param {SelectParams} query - Configure the fields to retrieve.
 * @param {UseQueryOptionsWrapper<HttpTypes.StoreRegionResponse, Error, QueryKey>} options - Query options.
 * @returns {UseQueryResult<HttpTypes.StoreRegionResponse, Error>} Query result.
 */
export const useRegion = (
  id: string,
  query?: SelectParams,
  options?: UseQueryOptionsWrapper<
    HttpTypes.StoreRegionResponse,
    Error,
    ReturnType<typeof storeKeys.regions.detail>
  >
): UseQueryResult<HttpTypes.StoreRegionResponse, Error> => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: storeKeys.regions.detail(id, query),
    queryFn: () => client.store.region.retrieve(id, query),
    enabled: !!id, // Ensure query doesn't run if id is not provided
    ...options,
  })

  return { ...data, ...rest } as UseQueryResult<HttpTypes.StoreRegionResponse, Error>;
} 