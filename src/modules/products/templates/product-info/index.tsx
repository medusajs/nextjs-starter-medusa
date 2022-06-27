import ProductActions from "@modules/products/components/product-actions"
import React from "react"
import { Product } from "types/medusa"

type ProductInfoProps = {
  product: Product
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
