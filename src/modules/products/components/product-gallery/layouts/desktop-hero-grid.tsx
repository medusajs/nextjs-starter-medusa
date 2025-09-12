"use client"

import React from "react"
import Image from "next/image"
import type { GalleryImage } from "../index"
import LightboxModal from "../lightbox-modal"

export default function DesktopHeroGrid({ images, lightbox, enabled = true, desktopInteraction = 'hybrid', showExpandIcon = true, motion = { promoteMs: 200 } }: { images: GalleryImage[]; lightbox?: boolean; enabled?: boolean; desktopInteraction?: 'promote' | 'lightbox' | 'hybrid'; showExpandIcon?: boolean; motion?: { promoteMs: number } }) {
  if (!images?.length) return null
  const hero = images[0]
  const [heroIndex, setHeroIndex] = React.useState(0)
  const rest = images.filter((_, i) => i !== heroIndex)
  const onThumbClick = (i: number) => {
    if (desktopInteraction === 'lightbox') {
      // TODO: open lightbox here when implemented
      return
    }
    // promote selected as hero
    setHeroIndex(i)
  }
  const [lightboxOpen, setLightboxOpen] = React.useState(false)
  const openLightbox = () => setLightboxOpen(true)
  const closeLightbox = () => setLightboxOpen(false)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <div className="lg:col-span-3 rounded-md overflow-hidden bg-gray-50 aspect-[4/3] relative">
        <Image src={images[heroIndex].url} alt={images[heroIndex].alt || ''} fill sizes="(min-width:1024px) 100vw, 100vw" className="object-cover" />
        {showExpandIcon && (
          <button onClick={openLightbox} className="absolute top-2 right-2 bg-white/75 rounded-full w-8 h-8 grid place-items-center text-gray-700 hover:bg-white" title="View fullscreen">
            ⤢
          </button>
        )}
      </div>
      {rest.map((img, idx) => {
        const originalIndex = images.indexOf(img)
        return (
          <button key={img.id || originalIndex} onClick={() => onThumbClick(originalIndex)} className="rounded-md overflow-hidden bg-gray-50 aspect-square relative group">
            <Image src={img.url} alt={img.alt || ''} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />
          </button>
        )
      })}
      <LightboxModal images={images} isOpen={lightboxOpen} initialIndex={heroIndex} onClose={closeLightbox} />
    </div>
  )
}


