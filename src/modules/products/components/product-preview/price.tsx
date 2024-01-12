import { Region } from "@medusajs/medusa"
import { Text, clx } from "@medusajs/ui"

import { retrievePricedProductById } from "@lib/data"
import { getProductPrice } from "@lib/util/get-product-price"
import { getRegion } from "app/actions"

import { PriceType } from "../product-actions/inner"

export default async function PreviewPrice({
  id,
  region,
  price: priceProp,
}: {
  id: string
  region?: Region
  price?: PriceType
}) {
  let price = priceProp

  if (!price) {
    const regionToUse = region ?? (await getRegion().then((region) => region))

    if (!regionToUse) {
      return null
    }

    const product = await retrievePricedProductById({
      id,
      regionId: regionToUse.id,
    }).then((product) => product)

    if (!product) {
      return null
    }

    const { cheapestPrice } = getProductPrice({
      product,
      region: regionToUse,
    })
    if (!cheapestPrice) {
      return null
    }

    price = cheapestPrice
  }

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
