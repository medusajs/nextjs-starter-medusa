import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"

import { RegionInfo } from "types/global"
import { getPercentageDiff } from "./get-precentage-diff"
import { convertToLocale } from "./money"

export function getProductPrice({
  product,
  variantId,
  region,
}: {
  product: PricedProduct
  variantId?: string
  region: RegionInfo
}) {
  if (!product || !product.id) {
    throw new Error("No product provided")
  }

  const cheapestPrice = () => {
    if (!product || !product.variants?.length || !region) {
      return null
    }

    const cheapestVariant: any = product.variants.sort((a: any, b: any) => {
      return (
        a.calculated_price.calculated_amount -
        b.calculated_price.calculated_amount
      )
    })[0]

    return {
      calculated_price_number:
        cheapestVariant.calculated_price.calculated_amount,
      calculated_price: convertToLocale({
        amount: cheapestVariant.calculated_price.calculated_amount,
        currency_code: cheapestVariant.calculated_price.currency_code,
      }),
      original_price_number: cheapestVariant.calculated_price.original_amount,
      original_price: convertToLocale({
        amount: cheapestVariant.calculated_price.original_amount,
        currency_code: cheapestVariant.calculated_price.currency_code,
      }),
      price_type: cheapestVariant.calculated_price_type,
      percentage_diff: getPercentageDiff(
        cheapestVariant.calculated_price.original_amount,
        cheapestVariant.calculated_price.calculated_amount
      ),
    }
  }

  const variantPrice = () => {
    if (!product || !variantId || !region) {
      return null
    }

    const variant: any = product.variants.find(
      (v) => v.id === variantId || v.sku === variantId
    )

    if (!variant) {
      return null
    }

    return {
      calculated_price_number: variant.calculated_price.calculated_amount,
      calculated_price: convertToLocale({
        amount: variant.calculated_price.calculated_amount,
        currency_code: variant.calculated_price.currency_code,
      }),
      original_price_number: variant.calculated_price.original_amount,
      original_price: convertToLocale({
        amount: variant.calculated_price.original_amount,
        currency_code: variant.calculated_price.currency_code,
      }),
      price_type: variant.calculated_price_type,
      percentage_diff: getPercentageDiff(
        variant.calculated_price.original_amount,
        variant.calculated_price.calculated_amount
      ),
    }
  }

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
  }
}
