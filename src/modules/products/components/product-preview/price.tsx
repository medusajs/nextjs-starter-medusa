import { Region } from "@medusajs/medusa"
import { Text, clx } from "@medusajs/ui"

import { retrievePricedProductById } from "@lib/data"
import { getProductPrice } from "@lib/util/get-product-price"
import { getRegion } from "app/actions"

import { PriceType } from "../product-actions"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"

export default async function PreviewPrice({ price }: { price: PriceType }) {
  return (
    <>
      {price.price_type === "sale" && (
        <Text className="line-through text-ui-fg-muted">
          {price.original_price}
        </Text>
      )}
      <Text
        className={clx("text-ui-fg-muted", {
          "text-ui-fg-interactive": price.price_type === "sale",
        })}
      >
        {price.calculated_price}
      </Text>
    </>
  )
}
