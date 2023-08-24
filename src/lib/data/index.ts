import { StoreGetProductsParams } from "@medusajs/medusa"

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"

type FetchProductListParams = {
  pageParam?: number
  queryParams: StoreGetProductsParams
}

export const fetchProductsList = async ({
  pageParam = 0,
  queryParams,
}: FetchProductListParams) => {
  const params = new URLSearchParams(queryParams as Record<string, string>)

  const { products, count, nextPage } = await fetch(
    `${API_BASE_URL}/api/products?limit=12&offset=${pageParam}&${params.toString()}`
  ).then((res) => res.json())

  return {
    response: { products, count },
    nextPage,
  }
}
