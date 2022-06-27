import { chunk } from "@lib/util/chunk"
import { findCheapestPrice } from "@lib/util/prices"
import { Product } from "@medusajs/medusa"
import clsx from "clsx"
import { useCart } from "medusa-react"
import Link from "next/link"
import React, { useMemo } from "react"
import Thumbnail from "../thumbnail"

type ProductDisplayProps = {
  products: Product[]
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ products }) => {
  const { cart } = useCart()

  const chunks = useMemo(() => {
    return chunk(products, 9)
  }, [products])

  return (
    <div className="grid grid-cols-3 gap-4 max-w-7xl mx-auto py-8">
      {chunks.map((products) =>
        products.map((product, i) => (
          <div
            key={product.id}
            className={clsx("col-span-1 row-span-1 relative", {
              "col-start-1 col-end-3 row-span-2": i === 3,
              "col-start-2 col-end-4 row-span-2": i === 7,
            })}
          >
            <Link href={`/products/${product.handle}`}>
              <a>
                <Thumbnail
                  images={product.images}
                  thumbnail={product.thumbnail}
                  size="full"
                />
              </a>
            </Link>
            <div className="absolute inset-x-4 bottom-4 flex justify-between items-end">
              <div className="flex flex-col">
                {product.collection && (
                  <Link href={`/collections/${product.collection.id}`}>
                    <a className="text-small-regular text-gray-500">
                      {product.collection?.title}
                    </a>
                  </Link>
                )}
                <Link href={`/products/${product.handle}`}>
                  <a className="text-base-regular">{product.title}</a>
                </Link>
              </div>
              {cart?.region && (
                <span className="text-base-regular">
                  {findCheapestPrice(product.variants, cart.region)}
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default ProductDisplay
