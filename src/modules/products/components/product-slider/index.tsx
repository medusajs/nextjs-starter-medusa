import { useWindowSize } from "@lib/hooks/use-window-size"
import { closest } from "@lib/util/closest"
import { findCheapestPrice } from "@lib/util/prices"
import SlideButton from "@modules/common/components/slide-button"
import Link from "next/link"
import React, { useCallback, useEffect, useRef, useState } from "react"
import Slider from "react-slick"
import { Product, Region } from "types/medusa"
import Thumbnail from "../thumbnail"

type RelatedProductsProps = {
  products: Product[]
  region?: Region
  heading?: string | React.ReactElement
}

const ProductSlider: React.FC<RelatedProductsProps> = ({
  heading = "Related products",
  products,
  region,
}) => {
  const [current, setCurrent] = useState(0)
  const [breakpoint, setBreakpoint] = useState(4)
  const currentWidth = useWindowSize()

  const sliderRef = useRef<any>(null)

  useEffect(() => {
    if (!currentWidth) {
      setBreakpoint(4)
      return
    } else if (currentWidth < 400) {
      setBreakpoint(1)
      return
    } else if (currentWidth < 600) {
      setBreakpoint(2)
      return
    } else if (currentWidth < 1024) {
      setBreakpoint(3)
      return
    } else {
      setBreakpoint(4)
      return
    }
  }, [currentWidth])

  const resetPosition = useCallback(() => {
    if (products.length % breakpoint !== 0) {
      const opts: number[] = []

      for (let i = 0; i < products.length; i += breakpoint) {
        opts.push(i)
      }

      const closestIndex = closest(current, opts)
      setCurrent(closestIndex)

      sliderRef.current.slickGoTo(closestIndex)
    }
  }, [breakpoint, current, products.length])

  useEffect(() => {
    window.addEventListener("resize", resetPosition)

    return () => window.removeEventListener("resize", resetPosition)
  }, [resetPosition])

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: false,
    afterChange: (current: number) => setCurrent(current),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <div className="flex flex-col gap-y-4 product-page-constraint">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl-regular">{heading}</h2>
      </div>
      <div className="relative">
        <Slider {...settings} ref={sliderRef}>
          {products.map((product) => {
            return (
              <div key={product.id}>
                <SlideItem product={product} region={region} />
              </div>
            )
          })}
        </Slider>
        <div className="absolute -left-2 top-[calc(50%-56px)]">
          <SlideButton
            direction="prev"
            onClick={() => {
              sliderRef?.current?.slickPrev()
            }}
          />
        </div>
        <div className="absolute -right-2 top-[calc(50%-56px)]">
          <SlideButton
            direction="next"
            onClick={() => {
              sliderRef?.current?.slickNext()
            }}
          />
        </div>
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
    <div className="slick-inner">
      <Link href={`/products/${product.handle}`} passHref>
        <div className="w-full">
          <Thumbnail {...product} size="full" />
          <div className="mt-3 flex flex-col">
            <span className="text-base-regular">{product.title}</span>
            <span className="text-small-regular text-gray-700">
              {region && findCheapestPrice(product.variants, region)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductSlider
