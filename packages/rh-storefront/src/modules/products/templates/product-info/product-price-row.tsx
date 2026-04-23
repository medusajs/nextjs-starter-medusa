"use client"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"

const RH_SALE = "#CA2022"

type ProductPriceRowProps = {
  product: HttpTypes.StoreProduct
}

export default function ProductPriceRow({ product }: ProductPriceRowProps) {
  const searchParams = useSearchParams()
  const vId = searchParams.get("v_id")

  const variant = useMemo(
    () => product.variants?.find((v) => v.id === vId),
    [product.variants, vId]
  )

  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice
  const multiVariant = (product.variants?.length ?? 0) > 1

  if (!selectedPrice) {
    return (
      <div
        className="box-border flex w-full flex-col items-start justify-center pr-2.5 pt-0.5"
        data-testid="price-display"
      >
        <div className="h-5 w-32 animate-pulse bg-qw-pale-grey" />
      </div>
    )
  }

  const isSale = selectedPrice.price_type === "sale"

  return (
    <div
      className="box-border flex w-full flex-col items-start justify-center pr-2.5 pt-0.5"
      data-testid="price-display"
    >
      <div className="flex flex-row flex-wrap items-baseline justify-start font-sans text-[13px] tracking-[0.165px] text-qw-black">
        {multiVariant && !variant ? (
          <div className="mr-1 flex flex-wrap items-baseline">
            <span
              className="my-0 mr-1 font-normal"
              style={{ color: isSale ? RH_SALE : undefined }}
            >
              Starting at
            </span>
          </div>
        ) : null}
        {isSale && selectedPrice.original_price ? (
          <span className="mr-1 tracking-[0.195px] line-through text-qw-medium-grey">
            {selectedPrice.original_price}
          </span>
        ) : null}
        <span
          className="tracking-[0.195px]"
          style={{ color: isSale ? RH_SALE : undefined }}
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
        {isSale && selectedPrice.percentage_diff ? (
          <span className="ml-1 text-[12px] text-qw-medium-grey">
            (-{selectedPrice.percentage_diff}%)
          </span>
        ) : null}
      </div>
    </div>
  )
}
