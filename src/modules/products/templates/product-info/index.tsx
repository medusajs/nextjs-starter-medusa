import ProductActions from "@modules/products/components/product-actions"
import React from "react"
import { ProductWithVariantsWithOptions } from "types/medusa"

type ProductInfoProps = {
  product: ProductWithVariantsWithOptions
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-12 lg:max-w-[500px] mx-auto">
        <div>
          <ProductActions product={product} />
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
