import useToggleState from "@lib/hooks/use-toggle-state"
import GalleryImage from "@modules/products/components/gallery-image"
import ImagesFullscreen from "@modules/products/components/images-fullscreen"
import JumpTo from "@modules/products/components/jump-to"
import React, { useState } from "react"
import { Product } from "types/medusa"

type GalleryProps = {
  product: Product
  inView?: boolean
}

const Gallery: React.FC<GalleryProps> = ({ product, inView = false }) => {
  const { open, close, state } = useToggleState()
  const [openOn, setOpenOn] = useState<string | undefined>(undefined)

  const handleOpen = (url: string) => {
    setOpenOn(url)
    open()
  }

  return (
    <div className="relative w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {product.images.map((image) => {
          return (
            <GalleryImage
              key={image.id}
              id={image.id}
              image={image}
              handleZoom={() => handleOpen(image.url)}
            />
          )
        })}
      </div>
      <ImagesFullscreen
        images={product.images}
        close={close}
        open={state}
        openOn={openOn}
      />
      <JumpTo product={product} show={!inView} />
    </div>
  )
}

export default Gallery
