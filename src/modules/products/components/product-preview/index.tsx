import useProductPrice from "@lib/hooks/use-product-price"
import clsx from "clsx"
import Link from "next/link"
import { Product } from "types/medusa"
import Thumbnail from "../thumbnail"

type ProductPreviewProps = Pick<
  Product,
  "id" | "title" | "handle" | "thumbnail"
>

const ProductPreview = ({ product }: { product: ProductPreviewProps }) => {
  const { cheapestPrice } = useProductPrice({ id: product.id })

  return (
    <Link href={`/products/${product.handle}`}>
      <a>
        <div>
          <Thumbnail thumbnail={product.thumbnail} size="full" />
          <div className="text-base-regular mt-2">
            <span>{product.title}</span>
            <div className="flex items-center gap-x-2 mt-1">
              {cheapestPrice ? (
                <>
                  {cheapestPrice.price_type === "sale" && (
                    <span className="line-through text-gray-500">
                      {cheapestPrice.original_price}
                    </span>
                  )}
                  <span
                    className={clsx("font-semibold", {
                      "text-rose-500": cheapestPrice.price_type === "sale",
                    })}
                  >
                    {cheapestPrice.calculated_price}
                  </span>
                </>
              ) : (
                <div className="w-14 h-4 animate-pulse bg-gray-50"></div>
              )}
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default ProductPreview
