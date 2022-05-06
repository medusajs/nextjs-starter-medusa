import { findCheapestPrice } from "@lib/util/prices"
import Link from "next/link"
import React, { useEffect, useRef, useState } from "react"
import { Product, Region } from "types/medusa"
import SlideButton from "../../../common/components/slide-button"
import Thumbnail from "../thumbnail"

type RelatedProductsProps = {
  products: Product[]
  region?: Region
  heading?: string | React.ReactElement
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  heading = "You might also like",
  products,
  region,
}) => {
  const maxScrollWidth = useRef(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const slider = useRef<HTMLDivElement>(null)

  const movePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1)
    }
  }

  const moveNext = () => {
    if (
      slider.current !== null &&
      slider.current.offsetWidth * currentIndex <= maxScrollWidth.current
    ) {
      setCurrentIndex((prevState) => prevState + 1)
    }
  }

  const isDisabled = (direction: string) => {
    if (direction === "prev") {
      return currentIndex <= 0
    }

    if (direction === "next" && slider.current !== null) {
      return slider.current.offsetWidth * currentIndex >= maxScrollWidth.current
    }

    return false
  }

  useEffect(() => {
    if (slider !== null && slider.current !== null) {
      slider.current.scrollLeft = slider.current.offsetWidth * currentIndex
    }
  }, [currentIndex])

  useEffect(() => {
    maxScrollWidth.current = slider.current
      ? slider.current.scrollWidth - slider.current.offsetWidth
      : 0
  }, [])

  return (
    <div className="gap-y-5 flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="text-xl-regular">{heading}</h3>
        <div className="flex items-center gap-x-3">
          <SlideButton
            direction="prev"
            disabled={isDisabled("prev")}
            onClick={movePrev}
          />
          <SlideButton
            direction="next"
            disabled={isDisabled("next")}
            onClick={moveNext}
          />
        </div>
      </div>
      <div
        className="relative flex gap-x-5 lg:gap-x-8 overflow-hidden scroll-smooth snap-x snap-mandatory touch-pan-x z-0"
        ref={slider}
      >
        {products.map((p, i) => {
          return <SlideItem key={i} product={p} region={region} />
        })}
      </div>
    </div>
  )
}

const SlideItem = ({
  product,
  region,
}: {
  product: Product
  region?: Region
}) => {
  return (
    <Link href={`/products/${product.handle}`} passHref>
      <div className="snap-start cursor-pointer">
        <Thumbnail {...product} size="large" />
        <div className="mt-3 flex flex-col">
          <span className="text-base-regular">{product.title}</span>
          <span className="text-small-regular text-gray-700">
            {region && findCheapestPrice(product.variants, region)}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default RelatedProducts
