import PlaceholderImage from "@modules/common/icons/placeholder-image"
import clsx from "clsx"
import Image from "next/image"
import React, { useState } from "react"
import { Product } from "types/medusa"

type ThumbnailProps = Pick<Product, "thumbnail" | "images"> & {
  size?: "small" | "medium" | "large" | "full"
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
}) => {
  const initialImage = thumbnail || images?.[0]?.url
  const alternateImage =
    images.find((image) => image.url !== initialImage)?.url || initialImage

  const [image, setImage] = useState(initialImage)

  return (
    <div
      className={clsx("relative aspect-[29/25]", {
        "w-[180px]": size === "small",
        "w-[290px]": size === "medium",
        "w-[440px]": size === "large",
        "w-full": size === "full",
      })}
      onMouseEnter={() => setImage(alternateImage)}
      onMouseLeave={() => setImage(initialImage)}
    >
      <ImageOrPlaceholder image={image} size={size} />
    </div>
  )
}

const ImageOrPlaceholder = ({ image, size }: Pick<ThumbnailProps, "size"> & { image?: string}) => {
  return image ? (
    <Image
        src={image}
        alt="Thumbnail"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        className="absolute inset-0"
      />
  ) : (
    <div className="w-full h-full absolute inset-0 bg-gray-100 flex items-center justify-center">
        <PlaceholderImage size={size === "small" ? 16 : 24}/>
      </div>
  )
}

export default Thumbnail
