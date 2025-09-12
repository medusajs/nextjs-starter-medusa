import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import FilteredProductsContainer from "@modules/store/components/filtered-products-container"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products-dropdown"
import { HttpTypes } from "@medusajs/types"
import SetFromContext from "@modules/common/components/set-from-context"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
  searchParams,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
  searchParams?: {
    tags?: string
    types?: string
    materials?: string
    sizes?: string
    price_min?: string
    price_max?: string
  }
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <Suspense
      fallback={
        <SkeletonProductGrid
          numberOfProducts={collection.products?.length}
        />
      }
    >
      <SetFromContext href={`/collections/${collection.handle}`} label={collection.title} />
      <FilteredProductsContainer
        sortBy={sort}
        page={pageNumber}
        collectionId={collection.id}
        countryCode={countryCode}
        title={collection.title}
        searchParams={searchParams}
      />
    </Suspense>
  )
}
