import { FindParams, HttpTypes, SelectParams } from "@medusajs/types"
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
 * Hook retrieves a list of payment providers available for a given context (e.g., region or cart).
 *
 * @param {FindParams & HttpTypes.StorePaymentProviderFilters} query - Filters (like `region_id`, `cart_id`) and pagination.
 * @param {UseQueryOptionsWrapper<HttpTypes.StorePaymentProviderListResponse, Error, QueryKey>} options - Query options.
 * @returns {UseQueryResult<HttpTypes.StorePaymentProviderListResponse, Error>} Query result.
 */
export const usePaymentProviders = (
  query: FindParams & HttpTypes.StorePaymentProviderFilters, // Query with context is required
  options?: UseQueryOptionsWrapper<
    HttpTypes.StorePaymentProviderListResponse,
    Error,
    ReturnType<typeof storeKeys.paymentProviders.list>
  >
): UseQueryResult<HttpTypes.StorePaymentProviderListResponse, Error> => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: storeKeys.paymentProviders.list(query),
    queryFn: () => client.store.payment.listPaymentProviders(query),
    enabled: !!query?.region_id,
    ...options,
  })

  return { ...data, ...rest } as UseQueryResult<
    HttpTypes.StorePaymentProviderListResponse,
    Error
  >
}

/**
 * Hook for initializing a payment session for a cart.
 * Creates a payment collection if one doesn't exist for the cart.
 *
 * @param {UseMutationOptionsWrapper<HttpTypes.StorePaymentCollectionResponse, Error, { cart: HttpTypes.StoreCart, body: HttpTypes.StoreInitializePaymentSession, query?: SelectParams }>} options - Mutation options.
 * @returns {UseMutationResult<HttpTypes.StorePaymentCollectionResponse, Error, { cart: HttpTypes.StoreCart, body: HttpTypes.StoreInitializePaymentSession, query?: SelectParams }>} Mutation result.
 */
export const useInitiatePaymentSession = (
  options?: UseMutationOptionsWrapper<
    HttpTypes.StorePaymentCollectionResponse,
    Error,
    {
      cart: HttpTypes.StoreCart
      body: HttpTypes.StoreInitializePaymentSession
      query?: SelectParams
    }
  >
): UseMutationResult<
  HttpTypes.StorePaymentCollectionResponse,
  Error,
  {
    cart: HttpTypes.StoreCart
    body: HttpTypes.StoreInitializePaymentSession
    query?: SelectParams
  }
> => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ cart, body, query }) =>
      client.store.payment.initiatePaymentSession(cart, body, query),
    onSuccess: (data, variables, context) => {
      // Invalidate the cart to reflect the new/updated payment collection and sessions
      queryClient.invalidateQueries({
        queryKey: storeKeys.carts.detail(variables.cart.id),
      })
      queryClient.invalidateQueries({ queryKey: storeKeys.carts.details() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
