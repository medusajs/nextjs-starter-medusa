import { useFeaturedProductsQuery } from "@lib/hooks/use-layout-data"
import { ProductCollection } from "@medusajs/medusa"
import ProductPreview from "@modules/products/components/product-preview"
import { Text } from "@medusajs/ui"
import { ArrowUpRightMini } from "@medusajs/icons"
import Link from "next/link"

const ProductRail = ({ collection }: { collection: ProductCollection }) => {
  const { data } = useFeaturedProductsQuery(collection.id)

  return (
    <div className="py-12">
      <div className="content-container py-12">
        <div className="flex justify-between mb-8">
          <Text className="txt-xlarge">{collection.title}</Text>
          <Link
            className="flex gap-x-1 items-center group"
            href={`/collections/${collection.handle}`}
          >
            <Text className="text-ui-fg-interactive">View all</Text>{" "}
            <ArrowUpRightMini
              className="group-hover:rotate-45 ease-in-out duration-150"
              color="var(--fg-interactive)"
            />
          </Link>
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
