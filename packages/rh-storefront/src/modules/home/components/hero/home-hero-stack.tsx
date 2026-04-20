"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"

export type HeroSlideConfig = {
  file: string
  aspectW: number
  aspectH: number
  alt: string
  href?: string
}

/**
 * aspectW/aspectH match each file’s pixel size (read from public/images/hero via `sips`).
 * Re-run after replacing assets: `sips -g pixelWidth -g pixelHeight public/images/hero/<file>`
 */
const HERO_SLIDES: HeroSlideConfig[] = [
  {
    file: "031226_od_sale_hp.webp",
    aspectW: 2000,
    aspectH: 1345,
    alt: "Outdoor sale — member savings on outdoor furniture",
    href: "/sale",
  },
  {
    file: "03172026_RH_HP_Spring_Sale_h1.webp",
    aspectW: 2600,
    aspectH: 1749,
    alt: "Spring sale — limited-time offers",
    href: "/sale",
  },
  {
    file: "03092026_RH_HP_Both_Led_H3_US_CA_EN.webp",
    aspectW: 2000,
    aspectH: 520,
    alt: "RH lighting and design collections",
    href: "/store",
  },
  {
    file: "02162026_RH_HP_EN_Sourcebook_Module INT_TWO_V5.webp",
    aspectW: 2000,
    aspectH: 1417,
    alt: "Sourcebooks and design inspiration",
    href: "/store",
  },
  {
    file: "03132026_RH_HP_Early_Spring_Sale_EN.webp",
    aspectW: 2000,
    aspectH: 652,
    alt: "Early spring sale",
    href: "/sale",
  },
  {
    file: "03272026_RH_HP_EN_Membership_Banner.png",
    aspectW: 3600,
    aspectH: 1839,
    alt: "RH members program",
    href: "/store",
  },
  {
    file: "02162026_RH_HP_Bookshelf.webp",
    aspectW: 2000,
    aspectH: 1550,
    alt: "Bookshelf and library collections",
    href: "/store",
  },
  {
    file: "02162026_RH_HP_RHID.webp",
    aspectW: 2000,
    aspectH: 1125,
    alt: "RH Interior Design",
    href: "/store",
  },
  {
    file: "01292026_RH_HP_Gary_Letter.png",
    aspectW: 3600,
    aspectH: 3549,
    alt: "Letter from Gary Friedman",
    href: "/store",
  },
  {
    file: "01292026_RH_HP_Guesthouse.webp",
    aspectW: 2000,
    aspectH: 1125,
    alt: "RH Guesthouse",
    href: "/store",
  },
  {
    file: "10162025_RH_BC_Pinterest-min.webp",
    aspectW: 1600,
    aspectH: 938,
    alt: "Baby & Child — Pinterest inspiration",
    href: "/store",
  },
]

const SWAP_MS = 30_000

export default function HomeHeroStack() {
  const [swapFirstTwo, setSwapFirstTwo] = useState(false)

  useEffect(() => {
    const id = window.setInterval(() => {
      setSwapFirstTwo((v) => !v)
    }, SWAP_MS)
    return () => window.clearInterval(id)
  }, [])

  const orderedIndices = useMemo(() => {
    const rest = HERO_SLIDES.map((_, i) => i).slice(2)
    const first = swapFirstTwo ? 1 : 0
    const second = swapFirstTwo ? 0 : 1
    return [first, second, ...rest]
  }, [swapFirstTwo])

  return (
    <div className="min-h-0 w-full min-w-0 max-w-full overflow-x-clip">
      {orderedIndices.map((slideIndex, position) => {
        const slide = HERO_SLIDES[slideIndex]
        const src = `/images/hero/${encodeURIComponent(slide.file)}`
        const ratioStyle = {
          aspectRatio: `${slide.aspectW} / ${slide.aspectH}`,
        } as const

        const media = (
          <div
            className="relative w-full overflow-hidden bg-transparent"
            style={ratioStyle}
          >
            <Image
              src={src}
              alt={slide.alt}
              fill
              sizes="100vw"
              priority={position === 0}
              className="object-fill object-center"
              decoding={position === 0 ? "sync" : "async"}
            />
          </div>
        )

        const block = slide.href ? (
          <LocalizedClientLink
            href={slide.href}
            className="block w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qw-charcoal"
          >
            {media}
          </LocalizedClientLink>
        ) : (
          media
        )

        return (
          <section
            key={slideIndex}
            className="relative w-full overflow-hidden bg-transparent"
          >
            {block}
          </section>
        )
      })}
    </div>
  )
}
