"use client"

import { useState, useRef, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { Text, Button } from "@medusajs/ui"
import { ChevronLeft, ChevronRight } from "@medusajs/icons"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

interface ProductSliderProps {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
  products: HttpTypes.StoreProduct[]
}

export default function ProductSlider({
  collection,
  region,
  products,
}: ProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const sliderRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const productsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  }

  const maxIndex = Math.max(0, products.length - productsPerView.desktop)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && products.length > productsPerView.desktop) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
      }, 4000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying, maxIndex, products.length])

  const handleMouseEnter = () => {
    setIsAutoPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const handleMouseLeave = () => {
    setIsAutoPlaying(true)
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-24">
      <div className="flex justify-between items-center mb-8">
        <Text className="txt-xlarge font-semibold">{collection.title}</Text>
        {collection.handle && (
          <InteractiveLink href={`/collections/${collection.handle}`}>
            Tümünü Gör
          </InteractiveLink>
        )}
      </div>

      <div
        className="product-slider-container rounded-lg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Slider Container */}
        <div
          ref={sliderRef}
          className="product-slider-track"
          style={{
            transform: `translateX(-${currentIndex * (100 / productsPerView.desktop)}%)`,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="product-slider-item"
              style={{ width: `${100 / productsPerView.desktop}%` }}
            >
              <ProductPreview product={product} region={region} isFeatured />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {products.length > productsPerView.desktop && (
          <>
            <Button
              variant="secondary"
              size="small"
              className="slider-nav-button left-4"
              onClick={prevSlide}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="secondary"
              size="small"
              className="slider-nav-button right-4"
              onClick={nextSlide}
            >
              <ChevronRight />
            </Button>
          </>
        )}

        {/* Dots Indicator */}
        {products.length > productsPerView.desktop && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${
                  index === currentIndex
                    ? "slider-dot-active"
                    : "slider-dot-inactive"
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Responsive Grid */}
      <div className="block small:hidden mt-8">
        <ul className="grid grid-cols-2 gap-4">
          {products.slice(0, 4).map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
        </ul>
        {products.length > 4 && collection.handle && (
          <div className="text-center mt-6">
            <InteractiveLink href={`/collections/${collection.handle}`}>
              <Button variant="secondary">
                Daha Fazla Ürün Gör ({products.length - 4} ürün daha)
              </Button>
            </InteractiveLink>
          </div>
        )}
      </div>
    </div>
  )
}
