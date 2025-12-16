"use server"

import { sdk } from "@lib/config"
import { OptionValueIds } from "@lib/util/product-option-filters"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags,",
          ...queryParams,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
const buildValueToOptionMap = (products: HttpTypes.StoreProduct[]) => {
  const map = new Map<string, string>()

  products.forEach((product) => {
    product.variants?.forEach((variant) => {
      variant.options?.forEach((option) => {
        if (option.id && option.option_id) {
          map.set(option.id, option.option_id)
        }
      })
    })
  })

  return map
}

const filterProductsByVariantOptionValues = (
  products: HttpTypes.StoreProduct[],
  optionValueIds?: OptionValueIds
) => {
  const filters = Array.from(new Set((optionValueIds || []).filter(Boolean)))

  if (!filters.length) {
    return products
  }

  const valueToOptionIdMap = buildValueToOptionMap(products)
  const groupedFilters = filters.reduce<Record<string, Set<string>>>(
    (acc, valueId) => {
      const optionId = valueToOptionIdMap.get(valueId)
      if (!optionId) {
        return acc
      }

      if (!acc[optionId]) {
        acc[optionId] = new Set()
      }

      acc[optionId].add(valueId)

      return acc
    },
    {}
  )

  if (!Object.keys(groupedFilters).length) {
    return products
  }

  return products.filter((product) =>
    (product.variants || []).some((variant) =>
      Object.entries(groupedFilters).every(([optionId, valueIds]) =>
        (variant.options || []).some(
          (option) => option.option_id === optionId && option.id && valueIds.has(option.id)
        )
      )
    )
  )
}

export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
  optionValueIds,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
  optionValueIds?: OptionValueIds
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
  })

  const filteredProducts = filterProductsByVariantOptionValues(
    products,
    optionValueIds
  )

  const sortedProducts = sortProducts(filteredProducts, sortBy)

  const pageParam = (page - 1) * limit

  const filteredCount = filteredProducts.length

  const nextPage =
    filteredCount > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count: filteredCount,
    },
    nextPage,
    queryParams,
  }
}
