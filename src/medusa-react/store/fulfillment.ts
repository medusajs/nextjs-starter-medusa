import { HttpTypes } from "@medusajs/types"
import { QueryKey, useQuery, UseQueryResult } from "@tanstack/react-query"

import { storeKeys } from "../query-keys"
import { UseQueryOptionsWrapper } from "../types"
import { useMedusa } from "../use-medusa"

/**
 * Hook retrieves a list of shipping options applicable to a cart.
 *
 * @param {HttpTypes.StoreGetShippingOptionList} query - Contains cart details (`cart_id` or region/items) and field selection.
 * @param {UseQueryOptionsWrapper<HttpTypes.StoreShippingOptionListResponse, Error, QueryKey>} options - Query options.
 * @returns {UseQueryResult<HttpTypes.StoreShippingOptionListResponse, Error>} Query result.
 */
export const useCartShippingOptions = (
  query: HttpTypes.StoreGetShippingOptionList, // Query is required here
  options?: UseQueryOptionsWrapper<
    HttpTypes.StoreShippingOptionListResponse,
    Error,
    ReturnType<typeof storeKeys.shippingOptions.cart>
  >
): UseQueryResult<HttpTypes.StoreShippingOptionListResponse, Error> => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: storeKeys.shippingOptions.cart(query),
    queryFn: () => client.store.fulfillment.listCartOptions(query),
    enabled: !!query?.cart_id,
    ...options,
  })

  return { ...data, ...rest } as UseQueryResult<
    HttpTypes.StoreShippingOptionListResponse,
    Error
  >
}
