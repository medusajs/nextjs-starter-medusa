"use client"

import { Fragment } from "react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { getProductPrice } from "@/utils/helpers/math"

import type { HttpTypes } from "@medusajs/types"

function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const t = useTranslations("features.product_detail.product_price")
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-muted animate-pulse" />
  }

  return (
    <div className="flex flex-col text-foreground">
      <span
        className={cn("text-xl", {
          "text-primary": selectedPrice.price_type === "sale",
        })}
      >
        {!variant && t("label.from")}{" "}
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
      </span>
      {selectedPrice.price_type === "sale" && (
        <Fragment>
          <p>
            <span className="text-foreground">{t("label.original")}: </span>
            <span
              className="line-through"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          </p>
          <span className="text-primary">
            -{selectedPrice.percentage_diff}%
          </span>
        </Fragment>
      )}
    </div>
  )
}

export { ProductPrice }
