import ProductSlider from "@modules/products/components/product-slider"
import { useCart } from "medusa-react"
import React from "react"
import { Product } from "types/medusa"

type RelatedProps = {
  relatedProducts: Product[]
}

const Related: React.FC<RelatedProps> = ({ relatedProducts }) => {
  const { cart } = useCart()
  return (
    <div>
      <ProductSlider products={relatedProducts} region={cart?.region} />
    </div>
  )
}

export default Related
