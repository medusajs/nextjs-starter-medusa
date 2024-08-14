import {
  PricedProduct,
  PricedVariant,
} from "@medusajs/medusa/dist/types/pricing"
import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { RegionInfo } from "types/global"
import { formatAmount } from "@lib/util/prices"


export default function ProductPrice({
  product,
  variant,
  region,
}: {
  product: PricedProduct
  variant?: PricedVariant
  region: RegionInfo
}) {
  // Get the cheapest price and the variant price of the product
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
    region,
  })

  // If a variant is provided, use its price; otherwise, use the cheapest price
  const selectedPrice = variant ? variantPrice : cheapestPrice

  // render a placeholder if there is no selected price
  if (!selectedPrice) {
    return <div className="block w-32 bg-gray-100 h-9 animate-pulse" />
  }

  // render the selected price if we have the data
  return (
    <div className="flex flex-col text-ui-fg-base">
      <span
        className={clx("text-xl-semi", {
          "text-ui-fg-interactive": selectedPrice.price_type === "sale",
        })}
      >
        {/* if there's no variant, display the text "From" before the pricing */}
        {!variant && "From "}
        {/* Display the original price including tax */}
        {/* NOTE to display other price amounts we will need to edit this component to accept a flag to know which price format to show. */}
        {/* currently limited to incl tax price only as thats what we want to display on product actions page */}
        <span
          data-testid="product-price"
          data-value={selectedPrice.original_price_incl_tax_number}
        >
          {selectedPrice.original_price_incl_tax}
        </span>
      </span>
      {/* If the price type is "sale", display the original price and the percentage difference */}
      {/* TODO can this section be deleted?? we don't have sale options */}
      {selectedPrice.price_type === "sale" && (
        <>
          <p>
            <span className="text-ui-fg-subtle">Original: </span>
            <span
              className="line-through"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          </p>
          <span className="text-ui-fg-interactive">
            -{selectedPrice.percentage_diff}%
          </span>
        </>
      )}
    </div>
  )
}
