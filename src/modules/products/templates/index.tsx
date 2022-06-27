import { ProductProvider } from "@lib/context/product-context"
import { useIntersection } from "@lib/hooks/use-in-view"
import { Product } from "@medusajs/medusa"
import Gallery from "@modules/products/templates/gallery"
import ProductInfo from "@modules/products/templates/product-info"
import React, { useRef } from "react"
import BreadCrumbs from "../components/bread-crumbs"
import ProductTabs from "../components/info-tabs"
import RelatedProducts from "../components/related-products"

type ProductTemplateProps = {
  product: Product
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({ product }) => {
  const info = useRef<HTMLDivElement>(null)

  const inView = useIntersection(info, "0px")

  console.log(product)

  return (
    <ProductProvider product={product}>
      <BreadCrumbs collection={product.collection} />
      <div className="flex product-page-constraint relative">
        <div className="w-full small:pr-8">
          <Gallery product={product} inView={inView} />
        </div>
        <div className="relative w-full max-w-[304px] small:max-w-[344px] medium:max-w-[400px]">
          <div className="sticky top-0 flex flex-col gap-y-8" ref={info}>
            <ProductInfo product={product} />
            <ProductTabs product={product} />
          </div>
        </div>
      </div>
      <div className="my-16 px-8 xl:my-32">
        <RelatedProducts product={product} />
      </div>
    </ProductProvider>
  )
}

export default ProductTemplate
