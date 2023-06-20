import { ProductVariant } from "@medusajs/medusa"
import Thumbnail from "@modules/products/components/thumbnail"
import Link from "next/link"

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

export type HitProps = {
  hit: ProductHit
}

const Hit = ({ hit }: HitProps) => {
  return (
    <div key={hit.id} className="grid grid-cols-[86px_1fr] gap-4 w-full">
      <Thumbnail thumbnail={hit.thumbnail} size="full" />
      <div className="flex flex-col justify-between">
        <div className="flex flex-col">
          {hit.collection_id && (
            <Link
              href={`/collections/${hit.collection_id}`}
              className="text-small-regular text-gray-500"
            >
              {hit.collection_handle}
            </Link>
          )}
          <span className="text-base-regular">{hit.title}</span>
          <span className="text-small-regular text-gray-700">
            {hit.description}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Hit
