import { Image as MedusaImage } from "@medusajs/medusa"
import Image from "next/image"
import React from "react"

type GalleryImageProps = {
  image: MedusaImage
} & React.HTMLAttributes<HTMLDivElement>

const GalleryImage: React.FC<GalleryImageProps> = ({ image, ...rest }) => {
  return (
    <div className="h-[calc(100vh-64px)] w-full relative" {...rest}>
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
