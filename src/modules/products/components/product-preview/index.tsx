import { Text } from "@medusajs/ui"
import Link from "next/link"
import { Suspense } from "react"

import { ProductPreviewType } from "types/global"

import PreviewPrice from "./price"
import Thumbnail from "../thumbnail"

export default async function ProductPreview({
  id,
  title,
  handle,
  thumbnail,
  price,
  isFeatured,
}: ProductPreviewType) {
  return (
    <Link href={`/products/${handle}`} className="group">
      <div>
        <Thumbnail thumbnail={thumbnail} size="full" isFeatured={isFeatured} />
        <div className="flex txt-compact-medium mt-4 justify-between">
          <Text className="text-ui-fg-subtle">{title}</Text>
          <div className="flex items-center gap-x-2">
            <Suspense
              fallback={
                <div className="w-20 h-6 animate-pulse bg-gray-100"></div>
              }
            >
              <PreviewPrice id={id} price={price} />
            </Suspense>
          </div>
        </div>
      </div>
    </Link>
  )
}
