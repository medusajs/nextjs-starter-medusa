import { Container } from "@/components/ui/react/design-system"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

type Props = {
  images: HttpTypes.StoreProductImage[]
}

function ImageGallery({ images }: Props) {
  return (
    <div className="flex items-start relative">
      <div className="flex flex-col flex-1 lg:mr-16 gap-y-4">
        {images.map((image, index) => {
          return (
            <Container
              key={image.id}
              className="relative aspect-[29/34] w-full overflow-hidden border rounded-lg"
              id={image.id}
            >
              {!!image.url && (
                <Image
                  src={image.url}
                  priority={index <= 2 ? true : false}
                  className="absolute inset-0"
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                  style={{
                    objectFit: "cover",
                  }}
                />
              )}
            </Container>
          )
        })}
      </div>
    </div>
  )
}

export { ImageGallery }
export type { Props as ImageGalleryProps }
