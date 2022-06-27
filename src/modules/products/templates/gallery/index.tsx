import useToggleState from "@lib/hooks/use-toggle-state"
import { Image } from "@medusajs/medusa"
import GalleryImage from "@modules/products/components/gallery-image"
import ImagesFullscreen from "@modules/products/components/images-fullscreen"
import JumpTo from "@modules/products/components/jump-to"
import clsx from "clsx"
import React, { useState } from "react"
import { Product } from "types/medusa"

type GalleryProps = {
  product: Product
  inView?: boolean
}

const Gallery: React.FC<GalleryProps> = ({ product, inView = false }) => {
  const { open, close, state } = useToggleState()
  const [openOn, setOpenOn] = useState<string | undefined>(undefined)

  const [currentImages, setCurrentImages] = useState<Image[] | undefined>(
    product.images.slice(0, 2)
  )

  const handleOpen = (url: string) => {
    setOpenOn(url)
    open()
  }

  return (
    <div className="relative w-full">
      <div
        className={clsx("grid grid-cols-1 gap-2", {
          "grid-cols-2": product.images.length > 2,
        })}
      >
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
