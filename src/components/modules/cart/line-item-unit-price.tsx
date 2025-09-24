"use client"

import { Fragment } from "react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { convertToLocale } from "@/utils/helpers/math"

import type { HttpTypes } from "@medusajs/types"

type Props = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
  currencyCode: string
}

function LineItemUnitPrice({ item, style = "default", currencyCode }: Props) {
  const t = useTranslations("modules.cart.line_item_unit_price")
  const { total, original_total } = item
  const hasReducedPrice = total < original_total

  const percentage_diff = Math.round(
    ((original_total - total) / original_total) * 100
  )

  return (
    <div className="flex flex-col text-muted-foreground justify-center h-full">
      {hasReducedPrice && (
        <Fragment>
          <p>
            {style === "default" && (
              <span className="text-muted-foreground">{t("label")}: </span>
            )}
            <span
              className="line-through"
              data-testid="product-unit-original-price"
            >
              {convertToLocale({
                amount: original_total / item.quantity,
                currency_code: currencyCode,
              })}
            </span>
          </p>
          {style === "default" && (
            <span className="text-primary">-{percentage_diff}%</span>
          )}
        </Fragment>
      )}
      <span
        className={cn("text-base", {
          "text-primary": hasReducedPrice,
        })}
        data-testid="product-unit-price"
      >
        {convertToLocale({
          amount: total / item.quantity,
          currency_code: currencyCode,
        })}
      </span>
    </div>
  )
}

export { LineItemUnitPrice }
export type { Props as LineItemUnitPriceProps }
