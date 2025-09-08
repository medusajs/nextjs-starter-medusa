import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import ProductSlider from "@modules/home/components/product-slider"

export default async function FeaturedProductsSlider({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  return (
    <div className="space-y-16">
      {collections.map(async (collection) => {
        const {
          response: { products: pricedProducts },
        } = await listProducts({
          regionId: region.id,
          queryParams: {
            collection_id: collection.id,
            fields: "*variants.calculated_price",
            limit: 12, // Limit products for better performance
          },
        })

        if (!pricedProducts || pricedProducts.length === 0 || !collection.handle) {
          return null
        }

        return (
          <ProductSlider
            key={collection.id}
            collection={collection}
            region={region}
            products={pricedProducts}
          />
        )
      })}
    </div>
  )
}
