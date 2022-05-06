import { ProductProvider } from "@lib/context/product-context"
import { useIntersection } from "@lib/hooks/use-in-view"
import Gallery from "@modules/products/templates/gallery"
import ProductInfo from "@modules/products/templates/product-info"
import Related from "@modules/products/templates/related"
import React, { useRef } from "react"
import { Product } from "types/medusa"

type ProductTemplateProps = {
  product: Product
  relatedProducts: Product[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  relatedProducts,
}) => {
  const info = useRef<HTMLDivElement>(null)

  const inView = useIntersection(info, "0px")

  return (
    <ProductProvider product={product}>
      <div className="flex flex-col lg:flex-row items-start gap-x-4 relative">
        <div className="w-full lg:w-6/12">
          <Gallery product={product} inView={inView} />
        </div>
        <div className="lg:w-6/12 lg:sticky lg:top-[64px]" ref={info}>
          <ProductInfo product={product} />
        </div>
      </div>
      <div className="my-16 lg:my-32">
        <Related relatedProducts={relatedProducts} />
      </div>
    </ProductProvider>
  )
}

export default ProductTemplate
