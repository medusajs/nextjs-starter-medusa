import React, { Suspense } from "react"

import ProductGallery from "@modules/products/components/product-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"
import Breadcrumbs from "@modules/common/components/breadcrumbs"

type ProductTemplateProps = {
    product: HttpTypes.StoreProduct
    region: HttpTypes.StoreRegion
    countryCode: string
    searchParams?: { [key: string]: string | string[] | undefined }
}

const ProductTemplate: React.FC<ProductTemplateProps> = async ({
    product,
    region,
    countryCode,
    searchParams = {},
}) => {
    if (!product || !product.id) {
        return notFound()
    }



    return (
        <>
            {/* Breadcrumbs */}
            <div className="content-container pt-6">
                <Breadcrumbs product={product} className="mb-4" />
            </div>
            {/* Core product functionality - never changes */}
            <div
                className="content-container grid grid-cols-1 md:grid-cols-5 cxs:!grid-cols-1 csm:!grid-cols-1 cmd:!grid-cols-5 py-8 md:py-12 cxs:!py-6 csm:!py-6 gap-6 cxs:!gap-4 csm:!gap-4 transition-all duration-200"
                data-testid="product-container"
            >
                {/* Image Column - 3/5 columns (60% width on desktop) */}
                <div className="md:col-span-3 transition-all duration-200">
                    <div className="w-full relative">
                        <ProductGallery images={(product?.images || []).map((img, i) => ({ id: img.id || String(i), url: img.url || '', alt: product?.title }))} />
                    </div>
                </div>
                
                {/* Details Column - 2/5 columns (40% width) - Grid auto-fills height! */}
                <div className="md:col-span-2 flex flex-col transition-all duration-200">
                    <div className="flex flex-col gap-y-6">
                        <ProductInfo product={product} />
                        <ProductTabs product={product} />
                        <ProductOnboardingCta />
                    </div>
                    
                    {/* Sticky Product Actions - 1em below nav (nav=4rem + 1rem = 5rem = top-20) */}
                    <div className="sticky top-20 bg-white mt-6 z-10 cxs:!static cxs:!mt-4 csm:!static csm:!mt-4">
                        <Suspense
                            fallback={
                                <ProductActions
                                    disabled={true}
                                    product={product}
                                    region={region}
                                />
                            }
                        >
                            <ProductActionsWrapper id={product.id} region={region} />
                        </Suspense>
                    </div>
                    
                    {/* Flex spacer - fills remaining height in the grid cell */}
                    <div className="flex-1"></div>
                </div>
            </div>
            
            {/* Related Products Section */}
            <div
                className="content-container my-8 md:my-12"
                data-testid="related-products-container"
            >
                <Suspense fallback={<SkeletonRelatedProducts />}>
                    <RelatedProducts product={product} countryCode={countryCode} />
                </Suspense>
            </div>
        </>
    )
}

export default ProductTemplate
