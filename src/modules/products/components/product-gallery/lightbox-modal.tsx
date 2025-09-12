"use client"

import * as React from "react"
import { Dialog } from "@headlessui/react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import type { GalleryImage } from "./index"

type LightboxModalProps = {
  images: GalleryImage[]
  isOpen: boolean
  initialIndex?: number
  onClose: () => void
}

export default function LightboxModal({ images, isOpen, initialIndex = 0, onClose }: LightboxModalProps) {
  const [index, setIndex] = React.useState(initialIndex)
  const count = images?.length || 0
  const goPrev = React.useCallback(() => setIndex(i => (i - 1 + count) % count), [count])
  const goNext = React.useCallback(() => setIndex(i => (i + 1) % count), [count])

  React.useEffect(() => {
    if (!isOpen) return
    setIndex(initialIndex)
  }, [isOpen, initialIndex])

  React.useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, goPrev, goNext, onClose])

  if (!count) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog as="div" className="relative z-[90]" open={isOpen} onClose={onClose}>
          <motion.div className="fixed inset-0 bg-black/90" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <div className="fixed inset-0">
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full max-h-[100dvh]">
                <button aria-label="Close" className="absolute top-4 right-4 z-[1] p-2 rounded-md text-white/90 hover:text-white" onClick={onClose}>
                  <X className="w-6 h-6" />
                </button>
                <button aria-label="Previous image" className="absolute left-4 top-1/2 -translate-y-1/2 z-[1] p-2 rounded-md text-white/90 hover:text-white" onClick={goPrev}>
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button aria-label="Next image" className="absolute right-4 top-1/2 -translate-y-1/2 z-[1] p-2 rounded-md text-white/90 hover:text-white" onClick={goNext}>
                  <ChevronRight className="w-7 h-7" />
                </button>
                <div className="absolute inset-0">
                  <Image
                    src={images[index].url}
                    alt={images[index].alt || ""}
                    fill
                    sizes="100vw"
                    className="object-contain select-none"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}


