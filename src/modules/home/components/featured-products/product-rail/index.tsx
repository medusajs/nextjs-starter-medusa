"use client"

import { useFeaturedProductsQuery } from "@lib/hooks/use-layout-data"
import { ProductCollection } from "@medusajs/medusa"
import ProductPreview from "@modules/products/components/product-preview"
import { Text } from "@medusajs/ui"
import InteractiveLink from "@modules/common/components/interactive-link"

const ProductRail = ({ collection }: { collection: ProductCollection }) => {
  const { data } = useFeaturedProductsQuery(collection.id)

  return (
    <div className="small:py-12">
      <div className="content-container py-12">
        <div className="flex justify-between mb-8">
          <Text className="txt-xlarge">{collection.title}</Text>
          <InteractiveLink href={`/collections/${collection.handle}`}>
            View all
          </InteractiveLink>
        </div>
        <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-8">
          {data &&
            data.map((product) => (
              <li key={product.id}>
                <ProductPreview isFeatured {...product} />
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default ProductRail
