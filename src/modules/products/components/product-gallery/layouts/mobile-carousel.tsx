"use client"

import React from "react"
import Image from "next/image"
import { useSwipeCarousel } from "@lib/hooks/use-swipe-carousel"
import type { GalleryImage } from "../index"

export default function MobileCarousel({ images, lightbox, enabled = true }: { images: GalleryImage[]; lightbox?: boolean; enabled?: boolean }) {
  const [index, setIndex] = React.useState(0)
  const open = (i: number) => setIndex(i)
  const { containerProps, goPrev, goNext, isDragging, dragX, thresholdPx } = useSwipeCarousel({ length: images.length, index, setIndex, loop: true })
  return (
    <div className="flex flex-col gap-2">
      <div className="w-full aspect-square bg-gray-50 relative overflow-hidden rounded-md select-none" {...(enabled ? containerProps : {})}>
        {images[index] && (
          <Image src={images[index].url} alt={images[index].alt || ""} fill sizes="100vw" className="object-cover" />
        )}
        {/* Optional visible arrows */}
        <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full w-8 h-8 grid place-items-center text-gray-700 hover:bg-white">‹</button>
        <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full w-8 h-8 grid place-items-center text-gray-700 hover:bg-white">›</button>
        {/* Subtle drag progress bar (only while dragging) */}
        {enabled && isDragging && (
          <div className="absolute left-0 right-0 bottom-0 h-1.5 bg-transparent">
            {dragX > 0 && (
              <div className="h-full bg-gray-900/30 transition-none" style={{ width: `${Math.min(Math.abs(dragX) / thresholdPx, 1) * 100}%` }} />
            )}
            {dragX < 0 && (
              <div className="h-full bg-gray-900/30 transition-none ml-auto" style={{ width: `${Math.min(Math.abs(dragX) / thresholdPx, 1) * 100}%` }} />
            )}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
        {images.map((img, i) => (
          <button key={img.id || i} onClick={() => open(i)} className={`w-10 h-10 rounded overflow-hidden border ${i === index ? 'border-gray-900' : 'border-gray-200'}`}>
            <Image src={img.url} alt={img.alt || ''} width={80} height={80} className="object-cover w-full h-full" />
          </button>
        ))}
      </div>
    </div>
  )
}


