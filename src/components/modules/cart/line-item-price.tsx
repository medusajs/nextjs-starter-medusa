import { convertToLocale } from "@/utils/helpers/math"
import { cn } from "@/lib/utils"

import type { HttpTypes } from "@medusajs/types"

type Props = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
  currencyCode: string
}

function LineItemPrice({ item, style = "default", currencyCode }: Props) {
  const { total, original_total } = item
  const originalPrice = original_total
  const currentPrice = total
  const hasReducedPrice = currentPrice < originalPrice

  return (
    <div className="flex flex-col gap-x-2 text-foreground items-end">
      <div className="flex items-center gap-1 text-left">
        {hasReducedPrice && (
          <p>
            <span
              className="line-through text-muted-foreground"
              data-testid="product-original-price"
            >
              {convertToLocale({
                amount: originalPrice,
                currency_code: currencyCode,
              })}
            </span>
          </p>
        )}
        <span
          className={cn("text-base", {
            "text-primary text-sm": hasReducedPrice,
          })}
          data-testid="product-price"
        >
          {convertToLocale({
            amount: currentPrice,
            currency_code: currencyCode,
          })}
        </span>
      </div>
    </div>
  )
}

export { LineItemPrice }
export type { Props as LineItemPriceProps }
