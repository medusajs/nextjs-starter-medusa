import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"

type ProductTemplateProps = {
    product: HttpTypes.StoreProduct
    region: HttpTypes.StoreRegion
    countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
    product,
    region,
    countryCode,
}) => {
    if (!product || !product.id) {
        return notFound()
    }

    return (
        <>
            <div
                className="content-container grid grid-cols-1 md:grid-cols-5 py-8 md:py-12 gap-6"
                data-testid="product-container"
            >
                {/* Image Column - 3/5 columns (60% width on desktop) */}
                <div className="md:col-span-3">
                    <div className="w-full relative">
                        <ImageGallery images={product?.images || []} />
                    </div>
                </div>
                
                {/* Details Column - 2/5 columns (40% width) - Grid auto-fills height! */}
                <div className="md:col-span-2 flex flex-col">
                    <div className="flex flex-col gap-y-6">
                        <ProductInfo product={product} />
                        <ProductTabs product={product} />
                        <ProductOnboardingCta />
                    </div>
                    
                    {/* Sticky Product Actions - 1em below nav (nav=4rem + 1rem = 5rem = top-20) */}
                    <div className="sticky top-20 bg-white mt-6 z-10">
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
