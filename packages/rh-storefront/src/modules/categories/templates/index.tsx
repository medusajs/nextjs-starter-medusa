import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { PlpViewConfig, PlpViewMode } from "@modules/store/lib/plp-view-config"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  viewMode,
  viewConfig,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  viewMode: PlpViewMode
  viewConfig: PlpViewConfig
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div className="w-full bg-[#f9f7f4]">
      <div className="content-container py-8 small:py-10" data-testid="category-container">
      <nav
        className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-caption uppercase tracking-[0.14em] text-qw-medium-grey mb-4"
        aria-label="Category"
      >
        {parents?.map((parent) => (
          <span key={parent.id} className="inline-flex items-baseline gap-x-2">
            <LocalizedClientLink
              className="text-inherit hover:text-qw-charcoal transition-colors duration-300"
              href={`/categories/${parent.handle}`}
              data-testid="sort-by-link"
            >
              {parent.name}
            </LocalizedClientLink>
            <span className="text-qw-light-grey" aria-hidden>
              /
            </span>
          </span>
        ))}
      </nav>
      <header className="border-b border-qw-pale-grey pb-6 mb-2">
        <div className="flex flex-col gap-6 small:flex-row small:items-end small:justify-between">
          <h1
            className="font-sans font-light text-qw-black uppercase tracking-[0.08em] text-[clamp(1.25rem,2vw,1.75rem)] leading-tight max-w-full small:max-w-[70%]"
            data-testid="category-page-title"
          >
            {category.name}
          </h1>
          <RefinementList
            sortBy={sort}
            viewMode={viewMode}
            allowedViews={viewConfig.allowedViews}
            data-testid="sort-by-container"
          />
        </div>
      </header>
      {category.description && (
        <div className="mt-6 mb-8 text-body text-qw-charcoal leading-relaxed max-w-3xl">
          <p>{category.description}</p>
        </div>
      )}
      {category.category_children && (
        <div className="mb-8 text-body text-qw-charcoal">
          <ul className="grid grid-cols-1 gap-2">
            {category.category_children?.map((c) => (
              <li key={c.id}>
                <InteractiveLink href={`/categories/${c.handle}`}>
                  {c.name}
                </InteractiveLink>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Suspense
        fallback={
          <SkeletonProductGrid numberOfProducts={category.products?.length ?? 8} />
        }
      >
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          categoryId={category.id}
          viewMode={viewMode}
          countryCode={countryCode}
        />
      </Suspense>
      </div>
    </div>
  )
}
