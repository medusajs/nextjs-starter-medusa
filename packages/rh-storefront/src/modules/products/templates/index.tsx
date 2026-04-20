import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <div className="w-full bg-[#f9f7f4]">
      <div
        className="relative mx-auto w-full max-w-[1920px] px-4 pb-6 pt-0 sm:px-6 min-[1600px]:max-w-[2560px] min-[1600px]:px-0 xl:pb-[29.6px]"
        data-testid="product-container"
      >
        <div className="mx-0 mt-0 flex flex-col pt-[8px] small:flex-row small:items-start">
          {/* RH: grid spacing / hero column padding */}
          <div className="order-1 relative block w-full min-w-0 px-4 pb-4 pt-[12.8px] small:w-1/2 small:max-w-[50%]">
            <ImageGallery images={images} />
          </div>

          <div className="order-2 mt-0 flex w-full min-w-0 flex-col gap-y-0 px-4 pb-4 pt-[12.8px] small:sticky small:top-48 small:w-1/2 small:max-w-[50%] lg:flex-1">
            <ProductInfo product={product} />
            <div className="mt-1">
              <ProductOnboardingCta />
            </div>
            <Suspense
              fallback={
                <ProductActions disabled={true} product={product} region={region} />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
            <div className="mt-5">
              <ProductTabs product={product} />
            </div>
          </div>
        </div>
      </div>
      <div
        className="mx-auto my-16 w-full max-w-[1920px] px-4 sm:px-6 min-[1600px]:max-w-[2560px] min-[1600px]:px-0 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProductTemplate
