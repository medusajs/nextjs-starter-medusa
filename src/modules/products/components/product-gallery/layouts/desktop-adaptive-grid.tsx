"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import type { GalleryImage } from "../index"
import LightboxModal from "../lightbox-modal"

export default function DesktopAdaptiveGrid({ images, lightbox, enabled = true, desktopInteraction = 'hybrid', showExpandIcon = true, motion: motionCfg = { promoteMs: 200 } }: { images: GalleryImage[]; lightbox?: boolean; enabled?: boolean; desktopInteraction?: 'promote' | 'lightbox' | 'hybrid'; showExpandIcon?: boolean; motion?: { promoteMs: number } }) {
  const [featured, setFeatured] = React.useState<number | null>(images?.length ? 0 : null)
  const [lightboxOpen, setLightboxOpen] = React.useState(false)
  const openLightbox = () => setLightboxOpen(true)
  const closeLightbox = () => setLightboxOpen(false)
  const onClick = (i: number) => {
    if (desktopInteraction === 'lightbox' && featured === i) {
      openLightbox()
      return
    }
    setFeatured(i)
  }

  if (!images?.length) return null

  React.useEffect(() => {
    if (images?.length && featured == null) setFeatured(0)
  }, [images, featured])

  // Keep DOM order stable to avoid scroll jumps; use CSS grid placement to float the featured item to the first row
  const ordered = React.useMemo(() => images.map((img, i) => ({ img, originalIndex: i })), [images])

  return (
    <div className="grid grid-cols-12 gap-3 grid-flow-row-dense" style={{ overflowAnchor: 'none' as any }}>
      {ordered.map(({ img, originalIndex }) => {
        const isFeatured = featured === originalIndex
        const colSpan = isFeatured ? 'col-span-12 row-start-1' : 'col-span-6 md:col-span-4'
        const aspect = isFeatured ? 'aspect-[4/3]' : 'aspect-square'
        return (
          <motion.div
            layout
            key={img.id || originalIndex}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onClick(originalIndex)}
            role="button"
            tabIndex={0}
            className={`${colSpan} ${aspect} rounded-md overflow-hidden bg-gray-50 relative group`}
            transition={{ layout: { duration: (motionCfg?.promoteMs ?? 200) / 1000 } }}
          >
            <Image draggable={false} src={img.url} alt={img.alt || ''} fill sizes="(min-width:1280px) 33vw, (min-width:1024px) 50vw, 100vw" className="object-cover select-none" />
            {isFeatured && showExpandIcon && (
              <button onClick={(e) => { e.stopPropagation(); openLightbox() }} className="absolute top-2 right-2 bg-white/75 rounded-full w-8 h-8 grid place-items-center text-gray-700 hover:bg-white" title="View fullscreen">⤢</button>
            )}
          </motion.div>
        )
      })}
      <LightboxModal images={images} isOpen={lightboxOpen} initialIndex={featured ?? 0} onClose={closeLightbox} />
    </div>
  )
}


