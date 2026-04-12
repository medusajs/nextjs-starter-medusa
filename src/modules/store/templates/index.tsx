import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { PlpViewConfig, PlpViewMode } from "@modules/store/lib/plp-view-config"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  q,
  viewMode,
  viewConfig,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  q?: string
  viewMode: PlpViewMode
  viewConfig: PlpViewConfig
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const normalizedQuery = q?.trim() ?? ""

  return (
    <div className="w-full bg-[#f9f7f4]">
      <div className="content-container py-8 small:py-10" data-testid="category-container">
      <header className="border-b border-qw-pale-grey pb-6 mb-2">
        <div className="flex flex-col gap-6 small:flex-row small:items-end small:justify-between">
          <h1
            className="font-sans font-light text-qw-black uppercase tracking-[0.08em] text-[clamp(1.25rem,2vw,1.75rem)] leading-tight max-w-full small:max-w-[70%]"
            data-testid="store-page-title"
          >
            {normalizedQuery
              ? `Search Results: "${normalizedQuery}"`
              : "All products"}
          </h1>
          <RefinementList
            sortBy={sort}
            viewMode={viewMode}
            allowedViews={viewConfig.allowedViews}
          />
        </div>
      </header>
      <Suspense fallback={<SkeletonProductGrid />}>
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          q={normalizedQuery}
          viewMode={viewMode}
          countryCode={countryCode}
        />
      </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
