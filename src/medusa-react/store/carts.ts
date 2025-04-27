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
 * Hook retrieves a specific cart by its ID.
 *
 * @param {string} id - The cart's ID.
 * @param {SelectParams} query - Configure the fields to retrieve.
 * @param {UseQueryOptionsWrapper<HttpTypes.StoreCartResponse, Error, QueryKey>} options - Query options.
 * @returns {UseQueryResult<HttpTypes.StoreCartResponse, Error>} Query result.
 */
export const useCart = (
  id: string,
  query?: SelectParams,
  options?: UseQueryOptionsWrapper<
    HttpTypes.StoreCartResponse,
    Error,
    ReturnType<typeof storeKeys.carts.detail>
  >
): UseQueryResult<HttpTypes.StoreCartResponse, Error> => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: storeKeys.carts.detail(id, query),
    queryFn: () => client.store.cart.retrieve(id, query),
    enabled: !!id,
    ...options,
  })

  return { ...data, ...rest } as UseQueryResult<
    HttpTypes.StoreCartResponse,
    Error
  >
}

/**
 * Hook for creating a cart.
 *
 * @param {UseMutationOptionsWrapper<HttpTypes.StoreCartResponse, Error, { body: HttpTypes.StoreCreateCart, query?: SelectParams }>} options - Mutation options.
 * @returns {UseMutationResult<HttpTypes.StoreCartResponse, Error, { body: HttpTypes.StoreCreateCart, query?: SelectParams }>} Mutation result.
 */
export const useCreateCart = (
  options?: UseMutationOptionsWrapper<
    HttpTypes.StoreCartResponse,
    Error,
    { body: HttpTypes.StoreCreateCart; query?: SelectParams }
  >
): UseMutationResult<
  HttpTypes.StoreCartResponse,
  Error,
  { body: HttpTypes.StoreCreateCart; query?: SelectParams }
> => {
  const { client } = useMedusa()
  // No invalidation needed typically, as new cart ID is returned and usually stored locally

  return useMutation({
    mutationFn: ({ body, query }) => client.store.cart.create(body, query),
    ...options,
  })
}

/**
 * Hook for updating a cart.
 *
 * @param {string} id - The cart's ID.
 * @param {UseMutationOptionsWrapper<HttpTypes.StoreCartResponse, Error, { body: HttpTypes.StoreUpdateCart, query?: SelectParams }>} options - Mutation options.
 * @returns {UseMutationResult<HttpTypes.StoreCartResponse, Error, { body: HttpTypes.StoreUpdateCart, query?: SelectParams }>} Mutation result.
 */
export const useUpdateCart = (
  id: string,
  options?: UseMutationOptionsWrapper<
    HttpTypes.StoreCartResponse,
    Error,
    { body: HttpTypes.StoreUpdateCart; query?: SelectParams }
  >
): UseMutationResult<
  HttpTypes.StoreCartResponse,
  Error,
  { body: HttpTypes.StoreUpdateCart; query?: SelectParams }
> => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ body, query }) => client.store.cart.update(id, body, query),
    onSuccess: (data, variables, context) => {
      // Invalidate the specific cart query
      queryClient.invalidateQueries({
        queryKey: storeKeys.carts.detail(id),
      })
      // Optionally invalidate broader cart details if needed
      queryClient.invalidateQueries({ queryKey: storeKeys.carts.details() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

/**
 * Hook for adding a line item to a cart.
 *
 * @param {string} cartId - The cart's ID.
 * @param {UseMutationOptionsWrapper<HttpTypes.StoreCartResponse, Error, { body: HttpTypes.StoreAddCartLineItem, query?: SelectParams }>} options - Mutation options.
 * @returns {UseMutationResult<HttpTypes.StoreCartResponse, Error, { body: HttpTypes.StoreAddCartLineItem, query?: SelectParams }>} Mutation result.
 */
export const useAddLineItem = (
  cartId: string,
  options?: UseMutationOptionsWrapper<
    HttpTypes.StoreCartResponse,
    Error,
    { body: HttpTypes.StoreAddCartLineItem; query?: SelectParams }
  >
): UseMutationResult<
  HttpTypes.StoreCartResponse,
  Error,
  { body: HttpTypes.StoreAddCartLineItem; query?: SelectParams }
> => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ body, query }) =>
      client.store.cart.createLineItem(cartId, body, query),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: storeKeys.carts.detail(cartId),
      })
      queryClient.invalidateQueries({ queryKey: storeKeys.carts.details() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

/**
 * Hook for updating a line item in a cart.
 *
 * @param {string} cartId - The cart's ID.
 * @param {string} lineItemId - The line item's ID.
 * @param {UseMutationOptionsWrapper<HttpTypes.StoreCartResponse, Error, { body: HttpTypes.StoreUpdateCartLineItem, query?: SelectParams }>} options - Mutation options.
 * @returns {UseMutationResult<HttpTypes.StoreCartResponse, Error, { body: HttpTypes.StoreUpdateCartLineItem, query?: SelectParams }>} Mutation result.
 */
export const useUpdateLineItem = (
  cartId: string,
  lineItemId: string,
  options?: UseMutationOptionsWrapper<
    HttpTypes.StoreCartResponse,
    Error,
    { body: HttpTypes.StoreUpdateCartLineItem; query?: SelectParams }
  >
): UseMutationResult<
  HttpTypes.StoreCartResponse,
  Error,
  { body: HttpTypes.StoreUpdateCartLineItem; query?: SelectParams }
> => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ body, query }) =>
      client.store.cart.updateLineItem(cartId, lineItemId, body, query),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: storeKeys.carts.detail(cartId),
      })
      queryClient.invalidateQueries({ queryKey: storeKeys.carts.details() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

/**
 * Hook for deleting a line item from a cart.
 *
 * @param {string} cartId - The cart's ID.
 * @param {string} lineItemId - The line item's ID.
 * @param {UseMutationOptionsWrapper<HttpTypes.StoreLineItemDeleteResponse, Error, void>} options - Mutation options.
 * @returns {UseMutationResult<HttpTypes.StoreLineItemDeleteResponse, Error, void>} Mutation result.
 */
export const useDeleteLineItem = (
  cartId: string,
  lineItemId: string,
  options?: UseMutationOptionsWrapper<
    HttpTypes.StoreLineItemDeleteResponse,
    Error,
    void
  >
): UseMutationResult<HttpTypes.StoreLineItemDeleteResponse, Error, void> => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.store.cart.deleteLineItem(cartId, lineItemId),
    onSuccess: (data, variables, context) => {
      // The response contains the updated cart as `parent`
      // We can update the cache directly or just invalidate
      queryClient.setQueryData(
        storeKeys.carts.detail(cartId), // Use a base key without query params for simple update
        { cart: data.parent } // Update cache with the parent cart from response
      )
      // Fallback invalidation
      queryClient.invalidateQueries({
        queryKey: storeKeys.carts.detail(cartId),
      })
      queryClient.invalidateQueries({ queryKey: storeKeys.carts.details() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

/**
 * Hook for adding a shipping method to a cart.
 *
 * @param {string} cartId - The cart's ID.
 * @param {UseMutationOptionsWrapper<HttpTypes.StoreCartResponse, Error, { body: HttpTypes.StoreAddCartShippingMethods, query?: SelectParams }>} options - Mutation options.
 * @returns {UseMutationResult<HttpTypes.StoreCartResponse, Error, { body: HttpTypes.StoreAddCartShippingMethods, query?: SelectParams }>} Mutation result.
 */
export const useAddShippingMethod = (
  cartId: string,
  options?: UseMutationOptionsWrapper<
    HttpTypes.StoreCartResponse,
    Error,
    { body: HttpTypes.StoreAddCartShippingMethods; query?: SelectParams }
  >
): UseMutationResult<
  HttpTypes.StoreCartResponse,
  Error,
  { body: HttpTypes.StoreAddCartShippingMethods; query?: SelectParams }
> => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ body, query }) =>
      client.store.cart.addShippingMethod(cartId, body, query),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: storeKeys.carts.detail(cartId),
      })
      queryClient.invalidateQueries({ queryKey: storeKeys.carts.details() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

/**
 * Hook for completing a cart and placing an order.
 *
 * @param {string} cartId - The cart's ID.
 * @param {UseMutationOptionsWrapper<HttpTypes.StoreCompleteCartResponse, Error, { query?: SelectParams }>} options - Mutation options.
 * @returns {UseMutationResult<HttpTypes.StoreCompleteCartResponse, Error, { query?: SelectParams }>} Mutation result.
 */
export const useCompleteCart = (
  cartId: string,
  options?: UseMutationOptionsWrapper<
    HttpTypes.StoreCompleteCartResponse,
    Error,
    { query?: SelectParams }
  >
): UseMutationResult<
  HttpTypes.StoreCompleteCartResponse,
  Error,
  { query?: SelectParams }
> => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ query }) => client.store.cart.complete(cartId, query),
    onSuccess: (data, variables, context) => {
      // Invalidate cart and potentially orders
      queryClient.invalidateQueries({
        queryKey: storeKeys.carts.detail(cartId),
      })
      queryClient.invalidateQueries({ queryKey: storeKeys.carts.details() })
      if (data.type === "order") {
        queryClient.invalidateQueries({ queryKey: storeKeys.orders.all })
      }
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

/**
 * Hook for transferring ownership of the current session's cart to the logged-in customer.
 *
 * @param {string} id - The cart's ID to transfer.
 * @param {UseMutationOptionsWrapper<HttpTypes.StoreCartResponse, Error, { query?: SelectParams }>} options - Mutation options.
 * @returns {UseMutationResult<HttpTypes.StoreCartResponse, Error, { query?: SelectParams }>} Mutation result.
 */
export const useTransferCart = (
  id: string,
  options?: UseMutationOptionsWrapper<
    HttpTypes.StoreCartResponse,
    Error,
    { query?: SelectParams }
  >
): UseMutationResult<
  HttpTypes.StoreCartResponse,
  Error,
  { query?: SelectParams }
> => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ query }) => client.store.cart.transferCart(id, query),
    onSuccess: (data, variables, context) => {
      // Invalidate the specific cart, potentially previous guest carts if tracked differently
      queryClient.invalidateQueries({ queryKey: storeKeys.carts.detail(id) })
      queryClient.invalidateQueries({ queryKey: storeKeys.carts.details() }) // Broad invalidation
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
