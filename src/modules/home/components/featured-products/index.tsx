import { ProductCollection } from "@medusajs/medusa"
import ProductRail from "./product-rail"

const FeaturedProducts = ({
  collections,
}: {
  collections: ProductCollection[]
}) => {
  return (
    <div className="py-12">
      <div className="py-12">
        <ul className="flex flex-col gap-x-6 gap-y-8">
          {collections.map((collection) => (
            <li key={collection.id}>
              <ProductRail collection={collection} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default FeaturedProducts
