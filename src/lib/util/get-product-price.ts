import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"

import { formatAmount } from "@lib/util/prices"
import { RegionInfo } from "types/global"
import { CalculatedVariant } from "types/medusa"

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

  const getPercentageDiff = (original: number, calculated: number) => {
    const diff = original - calculated
    const decrease = (diff / original) * 100

    return decrease.toFixed()
  }

  const cheapestPrice = () => {
    if (!product || !product.variants?.length || !region) {
      return null
    }

    const variants = product.variants as unknown as CalculatedVariant[]

    const cheapestVariant = variants.reduce((prev, curr) => {
      return prev.calculated_price < curr.calculated_price ? prev : curr
    })

    return {
      calculated_price_number: cheapestVariant.calculated_price,
      calculated_price: formatAmount({
        amount: cheapestVariant.calculated_price,
        region,
        includeTaxes: false,
      }),
      original_price_number: cheapestVariant.original_price,
      original_price: formatAmount({
        amount: cheapestVariant.original_price,
        region,
        includeTaxes: false,
      }),
      price_type: cheapestVariant.calculated_price_type,
      percentage_diff: getPercentageDiff(
        cheapestVariant.original_price,
        cheapestVariant.calculated_price
      ),
    }
  }

  const variantPrice = () => {
    if (!product || !variantId || !region) {
      return null
    }

    const variant = product.variants.find(
      (v) => v.id === variantId || v.sku === variantId
    ) as unknown as CalculatedVariant

    if (!variant) {
      return null
    }

    return {
      calculated_price_number: variant.calculated_price,
      calculated_price: formatAmount({
        amount: variant.calculated_price,
        region,
        includeTaxes: false,
      }),
      original_price_number: variant.original_price,
      original_price: formatAmount({
        amount: variant.original_price,
        region,
        includeTaxes: false,
      }),
      price_type: variant.calculated_price_type,
      percentage_diff: getPercentageDiff(
        variant.original_price,
        variant.calculated_price
      ),
    }
  }

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
  }
}
