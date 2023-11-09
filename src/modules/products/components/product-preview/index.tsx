import clsx from "clsx"
import Link from "next/link"
import { ProductPreviewType } from "types/global"
import Thumbnail from "../thumbnail"

const ProductPreview = ({
  title,
  handle,
  thumbnail,
  price,
}: ProductPreviewType) => (
  <Link href={`/products/${handle}`}>
    <div>
      <Thumbnail thumbnail={thumbnail} size="full" />
      <div className="flex txt-compact-medium mt-2 justify-between">
        <span className="text-ui-fg-subtle">{title}</span>
        <div className="flex items-center gap-x-2">
          {price ? (
            <>
              {price.price_type === "sale" && (
                <span className="line-through text-ui-fg-muted">
                  {price.original_price}
                </span>
              )}
              <span
                className={clsx("text-ui-fg-muted", {
                  "text-ui-fg-interactive": price.price_type === "sale",
                })}
              >
                {price.calculated_price}
              </span>
            </>
          ) : (
            <div className="w-20 h-6 animate-pulse bg-gray-100"></div>
          )}
        </div>
      </div>
    </div>
  </Link>
)

export default ProductPreview
