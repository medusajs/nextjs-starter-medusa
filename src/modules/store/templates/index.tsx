import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import FilteredProductsContainer from "@modules/store/components/filtered-products-container"
import BuilderWrapper from "@modules/common/components/builder-wrapper"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products-dropdown"
import { getBuilderContent } from "@lib/builder"

// Import Builder component registry
import "@modules/store/components/builder-registry"

const StoreTemplate = async ({
    sortBy,
    page,
    countryCode,
    searchParams,
    builderSearchParams,
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
    builderSearchParams?: { [key: string]: string | string[] | undefined }
}) => {
    const pageNumber = page ? parseInt(page) : 1
    const sort = sortBy || "created_at"

    // Check if we're in preview mode
    const isPreview = 
        builderSearchParams?.['builder.preview'] === 'true' ||
        builderSearchParams?.['__builder_editing__'] === 'true'

    // Fetch Builder content for store header/banner sections
    const builderContent = await getBuilderContent('store-content', {
        userAttributes: { 
            urlPath: '/store',
            countryCode,
            page: pageNumber.toString(),
            sortBy: sort
        },
        preview: isPreview
    })

    // Prepare data for Builder components
    const builderData = {
        sortBy: sort,
        page: pageNumber,
        countryCode,
        searchParams,
    }

    return (
        <>
            {/* Builder-customizable header/banner sections */}
            <BuilderWrapper
                model="store-content"
                content={builderContent}
                data={builderData}
            />
            
            {/* Core store functionality - always present */}
            <Suspense fallback={<SkeletonProductGrid />}>
                <FilteredProductsContainer
                    sortBy={sort}
                    page={pageNumber}
                    countryCode={countryCode}
                    title="All products"
                    searchParams={searchParams}
                />
            </Suspense>
        </>
    )
}

export default StoreTemplate
