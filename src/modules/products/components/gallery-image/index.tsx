import { Image as MedusaImage } from "@medusajs/medusa"
import Plus from "@modules/common/icons/plus"
import Image from "next/image"
import React from "react"

type GalleryImageProps = {
  image: MedusaImage
  handleZoom: (id: string) => void
} & React.HTMLAttributes<HTMLDivElement>

const GalleryImage: React.FC<GalleryImageProps> = ({
  image,
  handleZoom,
  ...rest
}) => {
  return (
    <div className="w-full aspect-[29/35] relative" {...rest}>
      <Image
        src={image.url}
        alt={`Product image`}
        layout="fill"
        objectFit="cover"
        className="absolute inset-0"
        quality={80}
        priority={true}
      />
      <div className="absolute bottom-4 right-4">
        <button
          onClick={() => handleZoom(image.url)}
          className="w-6 h-6 rounded-full bg-white flex items-center justify-center"
        >
          <Plus />
        </button>
      </div>
    </div>
  )
}

export default GalleryImage
