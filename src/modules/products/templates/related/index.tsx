import RelatedProducts from "@modules/products/components/related-products"
import { useCart } from "medusa-react"
import React from "react"
import { Product } from "types/medusa"

type RelatedProps = {
  relatedProducts: Product[]
}

const Related: React.FC<RelatedProps> = ({ relatedProducts }) => {
  const { cart } = useCart()
  return (
    <div className="px-4 lg:px-6">
      <RelatedProducts products={relatedProducts} region={cart?.region} />
    </div>
  )
}

export default Related
