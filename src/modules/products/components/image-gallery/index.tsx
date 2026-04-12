"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"

import { RH_IMAGE_BLUR_DATA_URL } from "@lib/util/image-blur"

const HERO_ASPECT = "1.02594 / 1" as const
const THUMB_ASPECT = "1.0223 / 1" as const

/** Lightbox: three discrete zoom steps (phase 1 — no pan). */
const LIGHTBOX_ZOOM_SCALES = [1, 1.4, 1.85] as const

/** RH header hover/surface background. */
const RH_HEADER_HOVER_BG_CLASS = "bg-[#f9f7f4]"
/** RH lightbox thumbnail rail shows ~3 items per viewport. */
const LIGHTBOX_THUMB_VISIBLE_COUNT = 3
/** RH thumbnail rail viewport height (px). */
const LIGHTBOX_THUMB_VIEWPORT_PX = 610
const LIGHTBOX_THUMB_STEP_PX = LIGHTBOX_THUMB_VIEWPORT_PX / LIGHTBOX_THUMB_VISIBLE_COUNT

/** RH PDP zoom rail: Grommet ZoomIn (25×25). */
function RhLightboxZoomInIcon() {
  return (
    <svg
      className="h-[25px] w-[25px] shrink-0"
      viewBox="0 0 25 25"
      fill="none"
      aria-hidden
    >
      <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
        <g transform="translate(0, 0.5)">
          <path
            d="M25,0 L25,25 L0,25 L0,0 L25,0 Z M13,6 L12,6 L12,11.999 L6,12 L6,13 L12,12.999 L12,19 L13,19 L13,13 L19,13 L19,12 L13,12 L13,6 Z"
            fill="#38352F"
            fillRule="evenodd"
            opacity={0.7}
          />
          <path
            d="M12.5,6 L12.5,19 M6,12.5 L19,12.5"
            stroke="#FFFFFF"
            strokeWidth={1}
            opacity={0.4}
          />
        </g>
      </g>
    </svg>
  )
}

/** RH PDP zoom rail: Grommet ZoomOut (25×25). */
function RhLightboxZoomOutIcon() {
  return (
    <svg
      className="h-[25px] w-[25px] shrink-0"
      viewBox="0 0 25 25"
      fill="none"
      aria-hidden
    >
      <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
        <path
          d="M25,0 L25,25 L0,25 L0,0 L25,0 Z M19,12 L6,12 L6,13 L19,13 L19,12 Z"
          fill="#38352F"
          fillRule="evenodd"
          opacity={0.7}
        />
        <line
          x1={6}
          y1={12.5}
          x2={19}
          y2={12.5}
          stroke="#FFFFFF"
          strokeWidth={1}
          opacity={0.4}
        />
      </g>
    </svg>
  )
}

/** RH lightbox thumb rail: 32×56 chevron rotated for up/down. */
function RhLightboxThumbChevronIcon({ direction }: { direction: "up" | "down" }) {
  return (
    <svg
      width={32}
      height={56}
      viewBox="0 0 32 56"
      fill="none"
      className={direction === "up" ? "rotate-90 text-[#0000008a]" : "-rotate-90 text-[#0000008a]"}
      aria-hidden
    >
      <rect width="32" height="56" className="fill-qw-white" opacity={0.5} />
      <path
        d="M22 40L10 28L22 16"
        stroke="currentColor"
        strokeWidth={1.5}
      />
    </svg>
  )
}

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const normalizedImages = useMemo(() => (images ?? []).filter(Boolean), [images])
  const imageKey = useMemo(
    () => normalizedImages.map((i) => i.id).join(","),
    [normalizedImages]
  )

  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [zoomStep, setZoomStep] = useState(0)
  const [lightboxThumbStart, setLightboxThumbStart] = useState(0)
  const [thumbOffset, setThumbOffset] = useState(0)

  const go = useCallback((dir: -1 | 1) => {
    setActiveIndex((i) => {
      const n = normalizedImages.length
      if (n === 0) return 0
      const next = i + dir
      return Math.max(0, Math.min(n - 1, next))
    })
  }, [normalizedImages.length])

  useEffect(() => {
    setActiveIndex(0)
  }, [imageKey])

  useEffect(() => {
    setZoomStep(0)
  }, [activeIndex, lightboxOpen])

  useEffect(() => {
    if (!lightboxOpen) return
    const n = normalizedImages.length
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        setLightboxOpen(false)
        return
      }
      if (e.key === "ArrowLeft" && n > 1) {
        e.preventDefault()
        go(-1)
        return
      }
      if (e.key === "ArrowRight" && n > 1) {
        e.preventDefault()
        go(1)
      }
    }
    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [lightboxOpen, normalizedImages.length, go])

  const activeImage = normalizedImages[activeIndex]

  if (!normalizedImages.length || !activeImage) {
    return null
  }

  const count = normalizedImages.length
  const canPrev = count > 1 && activeIndex > 0
  const canNext = count > 1 && activeIndex < count - 1
  const lightboxThumbMaxStart = Math.max(0, count - LIGHTBOX_THUMB_VISIBLE_COUNT)
  const lightboxThumbCanPrev = lightboxThumbStart > 0
  const lightboxThumbCanNext = lightboxThumbStart < lightboxThumbMaxStart
  const lightboxThumbTranslatePx = lightboxThumbStart * LIGHTBOX_THUMB_STEP_PX

  const visibleThumbs = 5
  const maxThumbOffset = Math.max(0, count - visibleThumbs)
  const canThumbPrev = thumbOffset > 0
  const canThumbNext = thumbOffset < maxThumbOffset

  /** PDP desktop strip (5 visible): left two slots → same as prev arrow; right two → same as next. */
  const handleDesktopThumbnailClick = useCallback(
    (index: number) => {
      const rel = index - thumbOffset
      if (rel === 0 || rel === 1) {
        if (canThumbPrev) {
          setThumbOffset((i) => Math.max(0, i - 1))
        }
        setActiveIndex(index)
        return
      }
      if (rel === 3 || rel === 4) {
        if (canThumbNext) {
          setThumbOffset((i) => Math.min(maxThumbOffset, i + 1))
        }
        setActiveIndex(index)
        return
      }
      setActiveIndex(index)
    },
    [thumbOffset, canThumbPrev, canThumbNext, maxThumbOffset]
  )

  useEffect(() => {
    setThumbOffset((prev) => Math.min(prev, maxThumbOffset))
  }, [maxThumbOffset])

  useEffect(() => {
    if (activeIndex < thumbOffset) {
      setThumbOffset(activeIndex)
      return
    }
    if (activeIndex >= thumbOffset + visibleThumbs) {
      setThumbOffset(Math.min(activeIndex - visibleThumbs + 1, maxThumbOffset))
    }
  }, [activeIndex, thumbOffset, maxThumbOffset])

  useEffect(() => {
    if (!lightboxOpen) return
    const visibleEnd = lightboxThumbStart + LIGHTBOX_THUMB_VISIBLE_COUNT - 1
    if (activeIndex < lightboxThumbStart) {
      setLightboxThumbStart(activeIndex)
      return
    }
    if (activeIndex > visibleEnd) {
      setLightboxThumbStart(
        Math.min(
          Math.max(0, activeIndex - LIGHTBOX_THUMB_VISIBLE_COUNT + 1),
          lightboxThumbMaxStart
        )
      )
    }
  }, [activeIndex, lightboxOpen, lightboxThumbStart, lightboxThumbMaxStart])

  useEffect(() => {
    setLightboxThumbStart((prev) => Math.min(prev, lightboxThumbMaxStart))
  }, [lightboxThumbMaxStart])

  return (
    <div className="pdpImageWrapper flex w-full flex-col">
      <div
        className="relative w-full pb-2 pt-0 md:pb-4"
        role="region"
        aria-roledescription="carousel"
        aria-label="Product images"
      >
        <div className="overflow-hidden">
          <div
            className="-ml-4 flex transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
          >
            {normalizedImages.map((img, index) => (
              <div
                key={img.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`Image ${index + 1} of ${count}`}
                className="min-w-0 shrink-0 grow-0 basis-full pl-4"
              >
                <div
                  className={`relative block h-full w-full ${RH_HEADER_HOVER_BG_CLASS}`}
                  style={{ aspectRatio: HERO_ASPECT }}
                >
                  <Image
                    src={img.url}
                    alt={index === 0 ? "Product image" : `Product image ${index + 1}`}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 767px) 100vw, 50vw"
                    placeholder="blur"
                    blurDataURL={RH_IMAGE_BLUR_DATA_URL}
                    className="object-contain object-center"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute -top-8 right-0 z-20 float-end bg-transparent p-0 sm:right-4 lg:bottom-4 lg:top-auto"
          aria-label="Zoom in"
        >
          <svg className="h-8 w-8" viewBox="0 0 25 25" fill="none" aria-hidden>
            <path
              d="M25,0 L25,25 L0,25 L0,0 L25,0 Z M13,6 L12,6 L12,11.999 L6,12 L6,13 L12,12.999 L12,19 L13,19 L13,13 L19,13 L19,12 L13,12 L13,6 Z"
              fill="#38352F"
              fillRule="evenodd"
              opacity={0.7}
            />
            <path
              d="M12.5,6 L12.5,19 M6,12.5 L19,12.5"
              stroke="#FFFFFF"
              strokeWidth={1}
              opacity={0.4}
            />
          </svg>
        </button>

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={!canPrev}
              className="absolute left-0 top-1/2 z-20 hidden h-[56px] w-[32px] -translate-y-1/2 items-center justify-center bg-transparent p-0 md:flex md:-translate-x-6 disabled:cursor-not-allowed disabled:opacity-25"
              aria-label="Previous slide"
            >
              <span className="sr-only">Previous slide</span>
              <svg width="32" height="56" viewBox="0 0 32 56" fill="none" aria-hidden>
                <path d="M22 40L10 28L22 16" stroke="#000" strokeWidth="1.5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={!canNext}
              className="absolute right-0 top-1/2 z-20 hidden h-[56px] w-[32px] -translate-y-1/2 items-center justify-center bg-transparent p-0 md:flex md:translate-x-6 disabled:cursor-not-allowed disabled:opacity-25"
              aria-label="Next slide"
            >
              <span className="sr-only">Next slide</span>
              <svg width="32" height="56" viewBox="0 0 32 56" fill="none" className="rotate-180" aria-hidden>
                <path d="M22 40L10 28L22 16" stroke="#000" strokeWidth="1.5" />
              </svg>
            </button>
          </>
        ) : null}

        {count > 1 ? (
          <div className="m-4 grid justify-center md:hidden">
            <div
              className="flex justify-center overflow-hidden"
              style={{ maxWidth: count * 5 + Math.max(0, count - 1) * 4 }}
              role="tablist"
              aria-label="Image indicators"
            >
              <div className="flex gap-1 transition-transform duration-300">
                {normalizedImages.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    role="tab"
                    aria-selected={i === activeIndex}
                    aria-label={`Image ${i + 1}`}
                    onClick={() => setActiveIndex(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: 5,
                      height: 5,
                      backgroundColor: i === activeIndex ? "#000" : "rgb(137, 136, 134)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {count > 1 ? (
        <div
          className="relative mt-0 w-full md:mt-2"
          role="region"
          aria-label="Product thumbnails"
          data-testid="component-image-thumbnail-list"
        >
          <div className="md:hidden">
            <div className="flex flex-wrap justify-center gap-0 overflow-x-auto pb-1 no-scrollbar">
              {normalizedImages.map((img, index) => {
                const isActive = index === activeIndex
                return (
                  <div
                    key={img.id}
                    className="box-border h-auto min-w-0 shrink-0 basis-[45%] overflow-y-hidden p-[0.8rem] sm:basis-[30%]"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={[
                        "relative block h-full w-full cursor-pointer overflow-hidden bg-transparent",
                        isActive
                          ? "border-[3px] border-white outline outline-1 outline-qw-black"
                          : "border border-transparent",
                      ].join(" ")}
                      aria-label={`View product image ${index + 1}`}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <div className="relative w-full" style={{ aspectRatio: THUMB_ASPECT }}>
                        <Image
                          src={img.url}
                          alt=""
                          fill
                          sizes="(max-width: 767px) 40vw, 20vw"
                          placeholder="blur"
                          blurDataURL={RH_IMAGE_BLUR_DATA_URL}
                          className="object-contain"
                        />
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setThumbOffset((i) => Math.max(0, i - 1))}
              disabled={!canThumbPrev}
              className="absolute left-0 top-1/2 z-20 h-6 w-4 -translate-x-5 -translate-y-1/2 bg-transparent p-0 disabled:cursor-not-allowed disabled:opacity-25"
              aria-label="Previous thumbnails"
            >
              <svg width="5" height="10" viewBox="0 0 6 12" fill="none" aria-hidden>
                <path d="M5 1L1 6L5 11" stroke="#000" strokeWidth="1" />
              </svg>
            </button>
            <div className="overflow-hidden px-2">
              <div
                className="-ml-4 flex transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                style={{ transform: `translate3d(-${thumbOffset * 20}%, 0, 0)` }}
              >
                {normalizedImages.map((img, index) => {
                  const isActive = index === activeIndex
                  return (
                    <div
                      key={img.id}
                      className="box-border h-auto min-w-0 shrink-0 basis-1/5 overflow-y-hidden p-[0.8rem] pl-4"
                    >
                      <button
                        type="button"
                        onClick={() => handleDesktopThumbnailClick(index)}
                        className={[
                          "relative block h-full w-full cursor-pointer overflow-hidden bg-transparent",
                          isActive
                            ? "border-[3px] border-white outline outline-1 outline-qw-black"
                            : "border border-transparent",
                        ].join(" ")}
                        aria-label={`View product image ${index + 1}`}
                        aria-current={isActive ? "true" : undefined}
                      >
                        <div className="relative w-full" style={{ aspectRatio: THUMB_ASPECT }}>
                          <Image
                            src={img.url}
                            alt=""
                            fill
                            sizes="20vw"
                            placeholder="blur"
                            blurDataURL={RH_IMAGE_BLUR_DATA_URL}
                            className="object-contain"
                          />
                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setThumbOffset((i) => Math.min(maxThumbOffset, i + 1))}
              disabled={!canThumbNext}
              className="absolute right-0 top-1/2 z-20 h-6 w-4 translate-x-6 -translate-y-1/2 bg-transparent p-0 disabled:cursor-not-allowed disabled:opacity-25"
              aria-label="Next thumbnails"
            >
              <svg width="5" height="10" viewBox="0 0 6 12" fill="none" aria-hidden>
                <path d="M1 1L5 6L1 11" stroke="#000" strokeWidth="1" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}

      {lightboxOpen ? (
        <div
          className={`fixed inset-0 z-[200] flex h-[100dvh] flex-col ${RH_HEADER_HOVER_BG_CLASS}`}
          role="dialog"
          aria-modal="true"
          aria-label="Image zoom"
          data-testid="zoom-container"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-[210] flex h-10 w-10 items-center justify-center bg-transparent p-0 text-qw-black transition-opacity duration-300 hover:opacity-70 md:right-8 md:top-8"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.25"
              />
            </svg>
          </button>

          <div className="flex min-h-0 flex-1 flex-nowrap flex-col md:flex-row">
            {/* RH zoom-container-media: main stage */}
            <div
              className={`relative flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center overflow-hidden ${RH_HEADER_HOVER_BG_CLASS} md:h-full md:w-[66.6667%] md:max-w-[66.6667%] md:flex-[0_0_66.6667%]`}
              data-testid="zoom-container-media"
            >
              <div
                className={`flex h-full w-full flex-1 items-center justify-center ${RH_HEADER_HOVER_BG_CLASS} px-4 py-10 md:px-0 md:py-0`}
              >
                <div
                  className={`relative mx-auto h-full w-full overflow-hidden ${RH_HEADER_HOVER_BG_CLASS}`}
                  style={{
                    width: "min(100%, 1470px)",
                    maxHeight: "100dvh",
                  }}
                >
                  <div
                    className="absolute inset-0 transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                    style={{
                      transform: `translate3d(0,0,0) scale(${LIGHTBOX_ZOOM_SCALES[zoomStep]})`,
                      transformOrigin: "center center",
                    }}
                  >
                    <div className={`relative h-full w-full ${RH_HEADER_HOVER_BG_CLASS}`}>
                      <Image
                        src={activeImage.url}
                        alt="Product image"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, min(1470px, 66vw)"
                        placeholder="blur"
                        blurDataURL={RH_IMAGE_BLUR_DATA_URL}
                        className="object-contain object-center opacity-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* RH: absolute bottom-2 right-2, column, transparent p-[10px] */}
              <div className="pointer-events-none absolute bottom-2 right-2 z-10 md:bottom-2 md:right-2">
                <div className="pointer-events-auto flex flex-col">
                  <div className="flex w-full justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        setZoomStep((s) =>
                          Math.min(LIGHTBOX_ZOOM_SCALES.length - 1, s + 1)
                        )
                      }
                      disabled={zoomStep >= LIGHTBOX_ZOOM_SCALES.length - 1}
                      className="bg-transparent p-[10px] outline-none transition-opacity duration-300 hover:opacity-80 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-qw-black disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Zoom in"
                    >
                      <RhLightboxZoomInIcon />
                    </button>
                  </div>
                  <div className="flex w-full justify-end">
                    <button
                      type="button"
                      onClick={() => setZoomStep((s) => Math.max(0, s - 1))}
                      disabled={zoomStep <= 0}
                      className="bg-transparent p-[10px] outline-none transition-opacity duration-300 hover:opacity-80 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-qw-black disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Zoom out"
                    >
                      <RhLightboxZoomOutIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {count > 1 ? (
              <aside
                className={`z-[1] flex w-full shrink-0 flex-col border-t border-qw-pale-grey ${RH_HEADER_HOVER_BG_CLASS} md:h-full md:w-[33.3333%] md:max-w-[33.3333%] md:flex-[0_0_33.3333%] md:border-l md:border-t-0 md:overflow-hidden md:px-10 md:py-10 lg:px-16 xl:px-20`}
                aria-label="Lightbox thumbnails"
                data-testid="thumbnail"
              >
                <div className="flex h-full min-h-0 items-center p-2 md:p-[14%] lg:mt-0 lg:px-[18%] lg:py-0 xl:px-[23%]">
                  <div
                    className="flex w-full flex-col items-center gap-4 opacity-100 transition-opacity"
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Zoom thumbnails"
                  >
                    <button
                      type="button"
                      className="flex h-8 w-14 shrink-0 items-center justify-center bg-transparent p-0 transition-opacity duration-300 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Scroll thumbnails up"
                      onClick={() =>
                        setLightboxThumbStart((prev) => Math.max(0, prev - 1))
                      }
                      disabled={!lightboxThumbCanPrev}
                    >
                      <RhLightboxThumbChevronIcon direction="up" />
                    </button>

                    <div
                      className="w-full overflow-hidden"
                      style={{ height: LIGHTBOX_THUMB_VIEWPORT_PX }}
                    >
                      <div
                        className="-mt-4 flex flex-col overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                        style={{
                          transform: `translate3d(0, -${lightboxThumbTranslatePx}px, 0)`,
                        }}
                      >
                        {normalizedImages.map((img, index) => {
                          const isActive = index === activeIndex
                          return (
                            <div
                              key={img.id}
                              role="group"
                              aria-roledescription="slide"
                              className="h-auto min-w-0 shrink-0 pt-4"
                              style={{ flexBasis: "33.3333%" }}
                            >
                              <button
                                type="button"
                                data-lightbox-thumb={index}
                                onClick={() => {
                                  setActiveIndex(index)
                                  const visibleStart = lightboxThumbStart
                                  const visibleEnd =
                                    visibleStart + LIGHTBOX_THUMB_VISIBLE_COUNT - 1
                                  if (
                                    index === visibleStart &&
                                    visibleStart > 0
                                  ) {
                                    setLightboxThumbStart(visibleStart - 1)
                                    return
                                  }
                                  if (
                                    index === visibleEnd &&
                                    visibleStart < lightboxThumbMaxStart
                                  ) {
                                    setLightboxThumbStart(visibleStart + 1)
                                  }
                                }}
                                className={[
                                  "relative block h-auto w-full overflow-hidden bg-transparent transition-all duration-300",
                                  isActive
                                    ? "border border-solid border-qw-black p-0.5"
                                    : "border border-transparent p-0",
                                ].join(" ")}
                                style={{ aspectRatio: THUMB_ASPECT }}
                                aria-label={`View product image ${index + 1}`}
                                aria-current={isActive ? "true" : undefined}
                              >
                                <div className="relative block h-full w-full">
                                  <Image
                                    src={img.url}
                                    alt=""
                                    fill
                                    sizes="(max-width: 768px) 25vw, 178px"
                                    placeholder="blur"
                                    blurDataURL={RH_IMAGE_BLUR_DATA_URL}
                                    className="h-full w-full object-contain opacity-100"
                                  />
                                </div>
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="flex h-8 w-14 shrink-0 items-center justify-center bg-transparent p-0 transition-opacity duration-300 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Scroll thumbnails down"
                      onClick={() =>
                        setLightboxThumbStart((prev) =>
                          Math.min(lightboxThumbMaxStart, prev + 1)
                        )
                      }
                      disabled={!lightboxThumbCanNext}
                    >
                      <RhLightboxThumbChevronIcon direction="down" />
                    </button>
                  </div>
                </div>
              </aside>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ImageGallery
