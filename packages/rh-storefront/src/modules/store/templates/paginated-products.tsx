import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { PlpViewMode } from "@modules/store/lib/plp-view-config"
import ProductReveal from "@modules/store/templates/product-reveal"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  q?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  q,
  collectionId,
  categoryId,
  productsIds,
  viewMode,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  q?: string
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  viewMode: PlpViewMode
  countryCode: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
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

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  if (q?.trim()) {
    queryParams["q"] = q.trim()
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
    sortBy,
    countryCode,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  const gridClassName =
    viewMode === 1
      ? "grid-cols-1"
      : viewMode === 2
        ? "grid-cols-2"
        : "grid-cols-1 small:grid-cols-2 large:grid-cols-3"
  const listClassName =
    viewMode === 3
      ? "grid w-full gap-x-4 gap-y-10 small:gap-x-6 small:gap-y-12 large:[grid-template-columns:repeat(3,minmax(0,31.3%))] large:justify-between"
      : `grid ${gridClassName} w-full gap-x-4 gap-y-10 small:gap-x-6 small:gap-y-12`

  return (
    <>
      {q ? (
        <p
          className="mb-6 text-caption uppercase tracking-[0.14em] text-qw-medium-grey"
          data-testid="store-search-count"
        >
          {count} {count === 1 ? "result" : "results"}
        </p>
      ) : (
        <p
          className="mb-6 text-caption uppercase tracking-[0.14em] text-qw-medium-grey"
          data-testid="store-product-count"
        >
          {count} {count === 1 ? "item" : "items"}
        </p>
      )}
      <ul
        className={listClassName}
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id} className="pb-[31px]">
              <ProductReveal>
                <ProductPreview
                  product={p}
                  region={region}
                  isFeatured
                />
              </ProductReveal>
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
    </>
  )
}
