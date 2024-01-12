import { ProductCollection } from "@medusajs/medusa"

import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  collections,
}: {
  collections: ProductCollection[]
}) {
  return collections.map((collection) => (
    <li key={collection.id}>
      <ProductRail collection={collection} />
    </li>
  ))
}
