import { ProductVariant } from "@medusajs/medusa"
import { Container, Heading, Text } from "@medusajs/ui"
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
    <Container
      key={hit.id}
      className="grid grid-cols-[1fr] gap-2 w-full p-4 shadow-elevation-card-rest hover:shadow-elevation-card-hover     items-center justify-center"
    >
      <Thumbnail thumbnail={hit.thumbnail} size="square" className="group" />
      <div className="flex flex-col justify-between group">
        <div className="flex flex-col">
          {hit.collection_id && (
            <Link
              href={`/collections/${hit.collection_handle}`}
              className="text-ui-fg-on-color hover:text-ui-fg-subtle"
            >
              {hit.collection_handle}
            </Link>
          )}
          <Text className="text-ui-fg-subtle">{hit.title}</Text>
        </div>
      </div>
    </Container>
  )
}

export default Hit
