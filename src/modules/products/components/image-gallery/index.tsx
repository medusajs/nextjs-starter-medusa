"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useMemo, useState } from "react"

import { RH_IMAGE_BLUR_DATA_URL } from "@lib/util/image-blur"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const normalizedImages = useMemo(() => {
    return (images ?? []).filter(Boolean)
  }, [images])

  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const activeImage = normalizedImages[activeIndex]

  if (!normalizedImages.length || !activeImage) {
    return null
  }

  return (
    <div className="flex items-start relative w-full">
      {/* Desktop: left thumbnails + right main image */}
      <div className="hidden small:flex gap-x-8 w-full">
        <div className="flex flex-col gap-y-4 w-[92px]">
          {normalizedImages.map((img, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={[
                  "relative w-[92px] h-[92px] overflow-hidden border",
                  isActive
                    ? "border-qw-black"
                    : "border-ui-border-base hover:border-qw-medium-grey",
                ].join(" ")}
                aria-label={`Select product image ${index + 1}`}
              >
                <Image
                  src={img.url}
                  alt={`Product thumbnail ${index + 1}`}
                  fill
                  sizes="96px"
                  placeholder="blur"
                  blurDataURL={RH_IMAGE_BLUR_DATA_URL}
                  className="absolute inset-0 object-cover"
                />
              </button>
            )
          })}
        </div>

        <div className="flex-1 relative aspect-[29/34] overflow-hidden bg-ui-bg-subtle">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="w-full h-full"
            aria-label="Open image lightbox"
          >
            <Image
              src={activeImage.url}
              alt="Product image"
              priority
              fill
              sizes="(max-width: 992px) 480px, 700px"
              placeholder="blur"
              blurDataURL={RH_IMAGE_BLUR_DATA_URL}
              className="absolute inset-0 object-cover rounded-none"
              style={{ objectFit: "cover" }}
            />
          </button>
        </div>
      </div>

      {/* Mobile: top main image + bottom horizontal thumbnails */}
      <div className="small:hidden w-full">
        <div className="relative aspect-[29/34] overflow-hidden bg-ui-bg-subtle">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="w-full h-full"
            aria-label="Open image lightbox"
          >
            <Image
              src={activeImage.url}
              alt="Product image"
              priority
              fill
              sizes="(max-width: 576px) 100vw"
              placeholder="blur"
              blurDataURL={RH_IMAGE_BLUR_DATA_URL}
              className="absolute inset-0 object-cover rounded-none"
              style={{ objectFit: "cover" }}
            />
          </button>
        </div>

        <div className="mt-6">
          <div className="flex gap-x-3 overflow-x-auto no-scrollbar">
            {normalizedImages.map((img, index) => {
              const isActive = index === activeIndex
              return (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={[
                    "relative w-[64px] h-[64px] overflow-hidden border",
                    isActive
                      ? "border-qw-black"
                      : "border-ui-border-base hover:border-qw-medium-grey",
                  ].join(" ")}
                  aria-label={`Select product image ${index + 1}`}
                >
                  <Image
                    src={img.url}
                    alt={`Product thumbnail ${index + 1}`}
                    fill
                    sizes="64px"
                    placeholder="blur"
                    blurDataURL={RH_IMAGE_BLUR_DATA_URL}
                    className="absolute inset-0 object-cover"
                  />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 z-[201] text-qw-white text-small-regular bg-black/30 border border-white/20 px-3 py-2"
          >
            Close
          </button>

          <div className="relative w-full max-w-[980px] aspect-[29/34] overflow-hidden">
            <Image
              src={activeImage.url}
              alt="Product image lightbox"
              fill
              priority
              sizes="(max-width: 992px) 90vw, 980px"
              placeholder="blur"
              blurDataURL={RH_IMAGE_BLUR_DATA_URL}
              className="absolute inset-0 object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageGallery
