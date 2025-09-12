"use client"

import React from "react"
import storeConfig from "../../../../../store.config"
import { useViewportBreakpoint } from "@lib/hooks/use-viewport-breakpoint"

export type GalleryImage = {
  id: string
  url: string
  alt?: string
  width?: number
  height?: number
  aspect?: number
}

export type GalleryVariant =
  | "mobile-carousel"
  | "desktop-hero-grid"
  | "desktop-carousel-grid"
  | "desktop-adaptive-grid"

interface ProductGalleryProps {
  images: GalleryImage[]
  lightbox?: boolean
  className?: string
}

// Static imports for reliability in all environments
import MobileCarousel from "./layouts/mobile-carousel"
import DesktopHeroGrid from "./layouts/desktop-hero-grid"
import DesktopCarouselGrid from "./layouts/desktop-carousel-grid"
import DesktopAdaptiveGrid from "./layouts/desktop-adaptive-grid"

export default function ProductGallery({ images, lightbox, className = "" }: ProductGalleryProps) {
  const { size: viewportSize, isAtLeast: isViewAtLeast } = useViewportBreakpoint()

  // Resolve config
  const galleryCfg = (storeConfig as any)?.productGallery || {}
  const bpMap = galleryCfg?.breakpoints || {}
  const enableLightbox = lightbox ?? (storeConfig as any)?.productGallery?.lightbox ?? true
  const desktopInteraction = galleryCfg?.desktopInteraction || 'hybrid'
  const showExpandIcon = galleryCfg?.showExpandIcon ?? true
  const motion = galleryCfg?.motion || { promoteMs: 200 }

  const desktopVariant: Exclude<GalleryVariant, 'mobile-carousel'> = (bpMap.desktop as any) || "desktop-hero-grid"
  const isMobile = viewportSize === 'xs' || viewportSize === 'sm' || !isViewAtLeast('md')

  const layoutProps = { images, lightbox: enableLightbox, desktopInteraction, showExpandIcon, motion }

  return (
    <div className={className}>
      {/* Render both to avoid first-paint swap. Visibility driven by viewport AND content media queries. */}
      {/* Mobile gallery: default block on small viewports, and also when content area is mobile-sized */}
      <div className="block md:hidden cxs:!block csm:!block cmd:!hidden" aria-hidden={!isMobile}>
        <MobileCarousel {...layoutProps} enabled={isMobile} />
      </div>
      {/* Desktop gallery: visible on md+ and when content area is md+; hidden when content is xs/sm */}
      <div className="hidden md:block cxs:!hidden csm:!hidden cmd:!block" aria-hidden={isMobile}>
        {desktopVariant === "desktop-hero-grid" && <DesktopHeroGrid {...layoutProps} enabled={!isMobile} />}
        {desktopVariant === "desktop-carousel-grid" && <DesktopCarouselGrid {...layoutProps} enabled={!isMobile} />}
        {desktopVariant === "desktop-adaptive-grid" && <DesktopAdaptiveGrid {...layoutProps} enabled={!isMobile} />}
      </div>
    </div>
  )
}


