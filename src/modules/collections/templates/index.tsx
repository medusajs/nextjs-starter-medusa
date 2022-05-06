import { ProductCollection } from "@medusajs/medusa"
import ProductPreview from "@modules/products/components/product-preview"
import { useCart } from "medusa-react"
import React from "react"
import { Product } from "types/medusa"
import FilterHeader from "../components/filter-header"

type CollectionTemplateProps = {
  collection: ProductCollection
  inititalProducts: Product[]
  count: number
  hasMore: boolean
}

const CollectionTemplate: React.FC<CollectionTemplateProps> = ({
  collection,
  inititalProducts,
  count,
  hasMore,
}) => {
  const { cart } = useCart()
  return (
    <div className="relative">
      <FilterHeader count={count} header={collection.title} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:px-8 lg:py-8">
        {inititalProducts.map((p) => (
          <ProductPreview key={p.id} product={p} region={cart?.region} />
        ))}
      </div>
    </div>
  )
}

export default CollectionTemplate
