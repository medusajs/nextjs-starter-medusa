import { ProductVariant } from "@medusajs/medusa"
import Thumbnail from "@modules/products/components/thumbnail"
import Link from "next/link"
import React from "react"

export type ProductHit = {
  id: string
  title: string
  handle: string
  description: string | null
  thumbnail: string | null
  variants: ProductVariant[]
  collection_handle: string | null
  collection_id: string | null
}

type HitProps = {
  hit: ProductHit
}

const Hit = ({ hit }: HitProps) => {
  return (
    <div key={hit.id} className="col-span-1 row-span-1 relative">
      <Link href={`/products/${hit.handle}`}>
        <a>
          <Thumbnail thumbnail={hit.thumbnail} size="full" />
        </a>
      </Link>
      <div className="absolute inset-x-4 bottom-4 flex justify-between items-end">
        <div className="flex flex-col">
          {hit.collection_id && (
            <Link href={`/collections/${hit.collection_id}`}>
              <a className="text-small-regular text-gray-500">
                {hit.collection_handle}
              </a>
            </Link>
          )}
          <Link href={`/products/${hit.handle}`}>
            <a className="text-base-regular">{hit.title}</a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Hit
