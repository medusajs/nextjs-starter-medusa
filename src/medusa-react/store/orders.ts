import { HttpTypes, SelectParams } from "@medusajs/types"
import {
  QueryKey,
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query"

import { storeKeys } from "../query-keys"
import { UseMutationOptionsWrapper, UseQueryOptionsWrapper } from "../types"
import { useMedusa } from "../use-medusa"

/**
 * Hook retrieves a list of orders based on filters (e.g., display_id, customer_id).
 * Typically used for logged-in customers.
 *
 * @param {HttpTypes.StoreOrderFilters} query - Filters and pagination configurations.
 * @param {UseQueryOptionsWrapper<HttpTypes.StoreOrderListResponse, Error, QueryKey>} options - Query options.
 * @returns {UseQueryResult<HttpTypes.StoreOrderListResponse, Error>} Query result.
 */
export const useOrders = (
  query?: HttpTypes.StoreOrderFilters,
  options?: UseQueryOptionsWrapper<
    HttpTypes.StoreOrderListResponse,
    Error,
    ReturnType<typeof storeKeys.orders.list>
  >
): UseQueryResult<HttpTypes.StoreOrderListResponse, Error> => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: storeKeys.orders.list(query),
    queryFn: () => client.store.order.list(query),
    ...options,
  })

  return { ...data, ...rest } as UseQueryResult<
    HttpTypes.StoreOrderListResponse,
    Error
  >
}

/**
 * Hook retrieves a specific order by its ID.
 * Requires authentication or specific query parameters like cart_id / email for access.
 *
 * @param {string} id - The order's ID.
 * @param {SelectParams} query - Configure the fields to retrieve.
 * @param {UseQueryOptionsWrapper<{ order: HttpTypes.StoreOrder }, Error, QueryKey>} options - Query options.
 * @returns {UseQueryResult<{ order: HttpTypes.StoreOrder }, Error>} Query result.
 */
export const useOrder = (
  id: string,
  query?: SelectParams,
  options?: UseQueryOptionsWrapper<
    { order: HttpTypes.StoreOrder }, // Adjusted based on SDK method return type
    Error,
    ReturnType<typeof storeKeys.orders.detail>
  >
): UseQueryResult<{ order: HttpTypes.StoreOrder }, Error> => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: storeKeys.orders.detail(id, query),
    queryFn: () => client.store.order.retrieve(id, query),
    enabled: !!id,
    ...options,
  })

  return { ...data, ...rest } as UseQueryResult<
    { order: HttpTypes.StoreOrder },
    Error
  >
}

/**
 * Hook for requesting an order transfer. Requires logged-in customer.
 *
 * @param {string} id - The order ID.
 * @param {UseMutationOptionsWrapper<HttpTypes.StoreOrderResponse, Error, { body: HttpTypes.StoreRequestOrderTransfer, query?: SelectParams }>} options - Mutation options.
 * @returns {UseMutationResult<HttpTypes.StoreOrderResponse, Error, { body: HttpTypes.StoreRequestOrderTransfer, query?: SelectParams }>} Mutation result.
 */
export const useRequestOrderTransfer = (
  id: string,
  options?: UseMutationOptionsWrapper<
    HttpTypes.StoreOrderResponse,
    Error,
    { body: HttpTypes.StoreRequestOrderTransfer; query?: SelectParams }
  >
): UseMutationResult<
  HttpTypes.StoreOrderResponse,
  Error,
  { body: HttpTypes.StoreRequestOrderTransfer; query?: SelectParams }
> => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ body, query }) =>
      client.store.order.requestTransfer(id, body, query),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.orders.detail(id) })
      queryClient.invalidateQueries({ queryKey: storeKeys.orders.details() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

/**
 * Hook for canceling an order transfer request. Requires logged-in customer.
 *
 * @param {string} id - The order ID.
 * @param {UseMutationOptionsWrapper<HttpTypes.StoreOrderResponse, Error, { query?: SelectParams }>} options - Mutation options.
 * @returns {UseMutationResult<HttpTypes.StoreOrderResponse, Error, { query?: SelectParams }>} Mutation result.
 */
export const useCancelOrderTransfer = (
  id: string,
  options?: UseMutationOptionsWrapper<
    HttpTypes.StoreOrderResponse,
    Error,
    { query?: SelectParams }
  >
): UseMutationResult<
  HttpTypes.StoreOrderResponse,
  Error,
  { query?: SelectParams }
> => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ query }) => client.store.order.cancelTransfer(id, query),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.orders.detail(id) })
      queryClient.invalidateQueries({ queryKey: storeKeys.orders.details() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

/**
 * Hook for accepting an order transfer. Requires transfer token and potentially login.
 *
 * @param {string} id - The order ID.
 * @param {UseMutationOptionsWrapper<HttpTypes.StoreOrderResponse, Error, { body: HttpTypes.StoreAcceptOrderTransfer, query?: SelectParams }>} options - Mutation options.
 * @returns {UseMutationResult<HttpTypes.StoreOrderResponse, Error, { body: HttpTypes.StoreAcceptOrderTransfer, query?: SelectParams }>} Mutation result.
 */
export const useAcceptOrderTransfer = (
  id: string,
  options?: UseMutationOptionsWrapper<
    HttpTypes.StoreOrderResponse,
    Error,
    { body: HttpTypes.StoreAcceptOrderTransfer; query?: SelectParams }
  >
): UseMutationResult<
  HttpTypes.StoreOrderResponse,
  Error,
  { body: HttpTypes.StoreAcceptOrderTransfer; query?: SelectParams }
> => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ body, query }) =>
      client.store.order.acceptTransfer(id, body, query),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.orders.detail(id) })
      queryClient.invalidateQueries({ queryKey: storeKeys.orders.details() })
      // May need to invalidate customer orders list as well
      queryClient.invalidateQueries({ queryKey: storeKeys.orders.lists() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

/**
 * Hook for declining an order transfer. Requires transfer token and potentially login.
 *
 * @param {string} id - The order ID.
 * @param {UseMutationOptionsWrapper<HttpTypes.StoreOrderResponse, Error, { body: HttpTypes.StoreDeclineOrderTransfer, query?: SelectParams }>} options - Mutation options.
 * @returns {UseMutationResult<HttpTypes.StoreOrderResponse, Error, { body: HttpTypes.StoreDeclineOrderTransfer, query?: SelectParams }>} Mutation result.
 */
export const useDeclineOrderTransfer = (
  id: string,
  options?: UseMutationOptionsWrapper<
    HttpTypes.StoreOrderResponse,
    Error,
    { body: HttpTypes.StoreDeclineOrderTransfer; query?: SelectParams }
  >
): UseMutationResult<
  HttpTypes.StoreOrderResponse,
  Error,
  { body: HttpTypes.StoreDeclineOrderTransfer; query?: SelectParams }
> => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ body, query }) =>
      client.store.order.declineTransfer(id, body, query),
    onSuccess: (data, variables, context) => {
      // Only the specific order state regarding transfer might change
      queryClient.invalidateQueries({ queryKey: storeKeys.orders.detail(id) })
      queryClient.invalidateQueries({ queryKey: storeKeys.orders.details() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
