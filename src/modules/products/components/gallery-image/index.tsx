import { Image as MedusaImage } from "@medusajs/medusa"
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
    <div
      className="w-full aspect-[29/35] relative cursor-pointer pointer-events-none lg:pointer-events-auto"
      {...rest}
      onClick={() => handleZoom(image.url)}
    >
      <Image
        src={image.url}
        alt={`Product image`}
        layout="fill"
        objectFit="cover"
        className="absolute inset-0"
        quality={80}
        priority={true}
      />
    </div>
  )
}

export default GalleryImage
