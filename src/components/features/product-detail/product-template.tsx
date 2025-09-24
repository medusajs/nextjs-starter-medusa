import { Fragment, Suspense } from "react"

import { Container } from "@/components/ui/react/design-system"
import { ImageGallery } from "@/components/features/product-detail/image-gallery"
import { ProductActions } from "@/components/features/product-detail/product-actions"
import { ProductTabs } from "@/components/features/product-detail/product-tabs"
import { ProductInfo } from "@/components/features/product-detail/product-info"
import { RelatedProducts } from "@/components/modules/product/related-products"
import { SkeletonRelatedProducts } from "@/components/modules/skeleton/related-products"

import type { HttpTypes } from "@medusajs/types"

type Props = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

function ProductTemplate({ product, region, countryCode }: Props) {
  return (
    <Fragment>
      <div
        className="container flex flex-col lg:flex-row lg:items-start py-6 relative"
        data-testid="product-container"
      >
        <div className="block w-full relative">
          <ImageGallery images={product?.images || []} />
        </div>
        <div className="flex flex-col lg:sticky lg:top-48 lg:py-0 lg:max-w-[500px] w-full py-8 gap-y-12">
          <ProductInfo product={product} />
          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
              />
            }
          >
            <ProductActions product={product} region={region} />
          </Suspense>
          <ProductTabs product={product} />
        </div>
      </div>
      <Container
        className="my-16 lg:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </Container>
    </Fragment>
  )
}

export { ProductTemplate }
export type { Props as ProductDetailProps }
