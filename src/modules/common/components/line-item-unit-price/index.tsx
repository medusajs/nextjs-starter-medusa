import { LineItem, Region } from "@medusajs/medusa"
import { clx } from "@medusajs/ui"

import { getPercentageDiff } from "@lib/util/get-precentage-diff"
import { convertToLocale } from "@lib/util/money"

type LineItemUnitPriceProps = {
  item: Omit<LineItem, "beforeInsert">
  region: Region
  style?: "default" | "tight"
}

const LineItemUnitPrice = ({
  item,
  region,
  style = "default",
}: LineItemUnitPriceProps) => {
  const originalPrice = (item.variant as any).calculated_price.original_amount
  const currentPrice = (item.variant as any).calculated_price.calculated_amount
  const hasReducedPrice = currentPrice < originalPrice

  return (
    <div className="flex flex-col text-ui-fg-muted justify-center h-full">
      {hasReducedPrice && (
        <>
          <p>
            {style === "default" && (
              <span className="text-ui-fg-muted">Original: </span>
            )}
            <span
              className="line-through"
              data-testid="product-unit-original-price"
            >
              {convertToLocale({
                amount: originalPrice,
                currency_code: region.currency_code,
              })}
            </span>
          </p>
          {style === "default" && (
            <span className="text-ui-fg-interactive">
              -{getPercentageDiff(originalPrice, currentPrice || 0)}%
            </span>
          )}
        </>
      )}
      <span
        className={clx("text-base-regular", {
          "text-ui-fg-interactive": hasReducedPrice,
        })}
        data-testid="product-unit-price"
      >
        {convertToLocale({
          amount: currentPrice || item.unit_price || 0,
          currency_code: region.currency_code,
        })}
      </span>
    </div>
  )
}

export default LineItemUnitPrice
