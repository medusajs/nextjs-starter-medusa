import { Fragment } from "react"

import { listProductsWithSort } from "@/utils/data/products"
import { getRegion } from "@/utils/data/regions"

import { ProductPreview } from "@/components/modules/product/product-preview"
import { Pagination } from "@/components/ui/react/pagination"

import type { SortOptions } from "@/components/modules/store/refinement-list"

const PRODUCT_LIMIT = 2

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

async function PaginatedProductGrid({
  page,
  collectionId,
  sortBy,
  categoryId,
  productsIds,
  countryCode,
}: {
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  sortBy?: SortOptions
}) {
  const queryParams: PaginatedProductsParams = {
    limit: PRODUCT_LIMIT,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    countryCode,
    sortBy,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <Fragment>
      <ul
        className="grid grid-cols-2 mb-5 w-full sm:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-5"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </Fragment>
  )
}

export { PaginatedProductGrid }
