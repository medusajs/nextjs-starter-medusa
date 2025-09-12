import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import FilterSortBar from "@modules/store/components/filter-sort-bar"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products-dropdown"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import Breadcrumbs, { BreadcrumbItem } from "@modules/common/components/breadcrumbs"
import SetFromContext from "@modules/common/components/set-from-context"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
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
    <>
      <SetFromContext href={`/categories/${category.handle}`} label={category.name} />
      {/* Breadcrumbs */}
      <div className="content-container pt-6">
        <Breadcrumbs category={category} className="mb-4" />
      </div>

      {/* Filter and Sort Bar - Sticky under header */}
      <FilterSortBar sortBy={sort} data-testid="sort-by-container" />
      
      {/* Main Content */}
      <div className="content-container py-6" data-testid="category-container">
        <div className="flex flex-row mb-8 text-2xl-semi gap-4">
          <h1 data-testid="category-page-title">{category.name}</h1>
        </div>
        
        {category.description && (
          <div className="mb-8 text-base-regular">
            <p>{category.description}</p>
          </div>
        )}
        
        {category.category_children && (
          <div className="mb-8 text-base-large">
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
            <SkeletonProductGrid
              numberOfProducts={category.products?.length ?? 8}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </>
  )
}
