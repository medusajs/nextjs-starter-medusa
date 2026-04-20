import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { PlpViewConfig, PlpViewMode } from "@modules/store/lib/plp-view-config"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  viewMode,
  viewConfig,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  viewMode: PlpViewMode
  viewConfig: PlpViewConfig
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="w-full bg-[#f9f7f4]">
      <div className="content-container py-8 small:py-10" data-testid="collection-container">
      <header className="border-b border-qw-pale-grey pb-6 mb-2">
        <div className="flex flex-col gap-6 small:flex-row small:items-end small:justify-between">
          <h1 className="font-sans font-light text-qw-black uppercase tracking-[0.08em] text-[clamp(1.25rem,2vw,1.75rem)] leading-tight max-w-full small:max-w-[70%]">
            {collection.title}
          </h1>
          <RefinementList
            sortBy={sort}
            viewMode={viewMode}
            allowedViews={viewConfig.allowedViews}
          />
        </div>
      </header>
      <Suspense
        fallback={
          <SkeletonProductGrid numberOfProducts={collection.products?.length} />
        }
      >
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          collectionId={collection.id}
          viewMode={viewMode}
          countryCode={countryCode}
        />
      </Suspense>
      </div>
    </div>
  )
}
