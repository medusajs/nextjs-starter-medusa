import { Image as MedusaImage } from "@medusajs/medusa"
import { Container } from "@medusajs/ui"
import PlaceholderImage from "@modules/common/icons/placeholder-image"
import clsx from "clsx"
import Image from "next/image"
import React from "react"

type ThumbnailProps = {
  thumbnail?: string | null
  images?: MedusaImage[] | null
  size?: "small" | "medium" | "large" | "full"
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <div
      className={clsx("relative aspect-[9/16]", {
        "w-[180px]": size === "small",
        "w-[290px]": size === "medium",
        "w-[440px]": size === "large",
        "w-full": size === "full",
      })}
    >
      <ImageOrPlaceholder image={initialImage} size={size} />
    </div>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
}: Pick<ThumbnailProps, "size"> & { image?: string }) => {
  return image ? (
    <Container
      key={image}
      className="relative aspect-[9/16] w-full overflow-hidden p-4 bg-ui-bg-subtle"
    >
      <Image
        src={image}
        alt="Thumbnail"
        className="absolute inset-0"
        draggable={false}
        fill
        sizes="100vw"
        style={{
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
    </Container>
  ) : (
    <Container className="w-full h-full absolute inset-0 bg-ui-bg-subtle flex items-center justify-center">
      <PlaceholderImage size={size === "small" ? 16 : 24} />
    </Container>
  )
}

export default Thumbnail
