import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import FilteredProductsContainer from "@modules/store/components/filtered-products-container"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products-dropdown"
import SetFromContext from "@modules/common/components/set-from-context"

const StoreTemplate = async ({
    sortBy,
    page,
    countryCode,
    searchParams,
}: {
    sortBy?: SortOptions
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
}) => {
    const pageNumber = page ? parseInt(page) : 1
    const sort = sortBy || "created_at"

    return (
        <Suspense fallback={<SkeletonProductGrid />}>
            <SetFromContext href="/store" label="Store" />
            <FilteredProductsContainer
                sortBy={sort}
                page={pageNumber}
                countryCode={countryCode}
                searchParams={searchParams}
                title="All products"
            />
        </Suspense>
    )
}

export default StoreTemplate
