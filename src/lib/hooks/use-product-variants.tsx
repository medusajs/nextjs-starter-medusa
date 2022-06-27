import { medusaClient } from "@lib/config"
import { StoreGetVariantsParams, StoreVariantsListRes } from "@medusajs/medusa"
import { useQuery, UseQueryOptions } from "react-query"

const fetchProductVariants = async (params?: StoreGetVariantsParams) => {
  return medusaClient.products.variants.list(params)
}

type UseProductVariantsOptions =
  | Omit<
      UseQueryOptions<
        StoreVariantsListRes,
        unknown,
        StoreVariantsListRes,
        (string | StoreGetVariantsParams | undefined)[]
      >,
      "queryKey" | "queryFn"
    >
  | undefined

const useProductVariants = (
  query?: StoreGetVariantsParams,
  options?: UseProductVariantsOptions
) => {
  const { data, ...rest } = useQuery(
    ["product-variants", query],
    () => fetchProductVariants(query),
    options
  )

  return { ...data, ...rest }
}

export default useProductVariants
