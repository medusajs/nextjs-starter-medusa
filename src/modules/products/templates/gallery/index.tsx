import GalleryImage from "@modules/products/components/gallery-image"
import JumpTo from "@modules/products/components/jump-to"
import React from "react"
import { Product } from "types/medusa"

type GalleryProps = {
  product: Product
  inView?: boolean
}

const Gallery: React.FC<GalleryProps> = ({ product, inView = false }) => {
  return (
    <div className="relative w-full">
      {product.images.map((image) => {
        return <GalleryImage key={image.id} id={image.id} image={image} />
      })}
      <JumpTo product={product} show={!inView} />
    </div>
  )
}

export default Gallery
