"use client"

import React from "react"
import Image from "next/image"
import { useSwipeCarousel } from "@lib/hooks/use-swipe-carousel"
import type { GalleryImage } from "../index"
import LightboxModal from "../lightbox-modal"

export default function DesktopCarouselGrid({ images, lightbox, enabled = true, desktopInteraction = 'hybrid', showExpandIcon = true, motion = { promoteMs: 200 } }: { images: GalleryImage[]; lightbox?: boolean; enabled?: boolean; desktopInteraction?: 'promote' | 'lightbox' | 'hybrid'; showExpandIcon?: boolean; motion?: { promoteMs: number } }) {
  const [index, setIndex] = React.useState(0)
  const { containerProps, goPrev, goNext, isDragging, dragX, thresholdPx } = useSwipeCarousel({ length: images.length, index, setIndex, loop: true })
  const [lightboxOpen, setLightboxOpen] = React.useState(false)
  const openLightbox = () => setLightboxOpen(true)
  const closeLightbox = () => setLightboxOpen(false)
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const focusContainer = () => containerRef.current?.focus()
  return (
    <div className="grid grid-cols-1 gap-3">
      <div
        ref={containerRef}
        className="rounded-md overflow-hidden bg-gray-50 aspect-[4/3] relative focus:outline-none"
        {...(enabled ? containerProps : {})}
      >
        {images[index] && (
          <Image draggable={false} src={images[index].url} alt={images[index].alt || ''} fill sizes="(min-width:1024px) 66vw, 100vw" className="object-cover select-none pointer-events-none" />
        )}
        <button data-no-swipe onClick={() => { goPrev(); focusContainer() }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full w-8 h-8 grid place-items-center text-gray-700 hover:bg-white">‹</button>
        <button data-no-swipe onClick={() => { goNext(); focusContainer() }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full w-8 h-8 grid place-items-center text-gray-700 hover:bg-white">›</button>
        {showExpandIcon && (
          <button onClick={openLightbox} className="absolute top-2 right-2 bg-white/75 rounded-full w-8 h-8 grid place-items-center text-gray-700 hover:bg-white" title="View fullscreen">⤢</button>
        )}
        {enabled && isDragging && (
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] overflow-hidden">
            <div
              className="absolute inset-0 h-full bg-gray-900/30 transition-transform duration-75 ease-out"
              style={{ transform: `scaleX(${Math.min(Math.abs(dragX) / thresholdPx, 1)})`, transformOrigin: dragX > 0 ? 'left' : 'right' }}
            />
          </div>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
        {images.map((img, i) => (
          <button key={img.id || i} onClick={() => { setIndex(i); focusContainer() }} className={`rounded overflow-hidden border ${i === index ? 'border-gray-900' : 'border-gray-200'}`}>
            <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gray-50">
              <Image draggable={false} src={img.url} alt={img.alt || ''} fill sizes="(min-width:1024px) 10vw, 25vw" className="object-cover select-none" />
            </div>
          </button>
        ))}
      </div>
      <LightboxModal images={images} isOpen={lightboxOpen} initialIndex={index} onClose={closeLightbox} />
    </div>
  )
}


