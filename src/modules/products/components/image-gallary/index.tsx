import { Image as MedusaImage } from "@medusajs/medusa"
import clsx from "clsx"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

type ImageGalleryProps = {
  images: MedusaImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      })
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setCurrentIndex(index)
            console.log(index)
          }
        })
      },
      { rootMargin: "200px 0px 0px 0px" }
    )

    for (const ref of imageRefs.current) {
      if (ref) {
        observer.observe(ref)
      }
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className="flex items-start relative">
      <div className="hidden small:flex flex-col gap-y-4 sticky top-20">
        {images.map((image, index) => {
          return (
            <button
              key={image.id}
              className={clsx("h-14 w-12 relative border border-white", {
                "border-gray-900": currentIndex === index,
              })}
              onClick={() => {
                handleScrollTo(image.id)
              }}
            >
              <Image
                src={image.url}
                layout="fill"
                objectFit="cover"
                className="absolute inset-0"
                alt=""
              />
            </button>
          )
        })}
      </div>
      <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
        {images.map((image) => {
          return (
            <div
              ref={(image) => imageRefs.current.push(image)}
              key={image.id}
              className="relative aspect-[29/34] w-full"
              id={image.id}
            >
              <Image
                src={image.url}
                layout="fill"
                objectFit="cover"
                className="absolute inset-0"
                alt=""
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ImageGallery
