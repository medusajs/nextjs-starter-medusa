import {
  ProductDTO,
  ProductVariantDTO,
} from "@medusajs/types/dist/product/common"

type MoneyAmount = {
  money_amount?: {
    amount: number
    currency_code: string
    variant_id: string
    money_amount_id: string
    id: string
  }
  id?: string
  variant_id?: string
  money_amount_id?: string
  amount?: number
  currency_code?: string
}

type ProductVariantDTOWithPrices = ProductVariantDTO & {
  prices: MoneyAmount[]
  calculated_price: number
}

type ProductDTOWithPrices = Omit<ProductDTO, "variants"> & {
  variants: ProductVariantDTOWithPrices[]
}
/**
 * Formats the price response to match the format of the regular products endpoint
 * @param products (array) - An array of products
 * @returns products (array) - A formatted array of products
 */
export const formatVariantPrices = (products: ProductDTOWithPrices[]) => {
  products.forEach((product) => {
    product.variants.forEach((variant) => {
      const formattedPrices = variant.prices.map((price) => {
        const money_amount = price.money_amount
        delete price.money_amount
        return {
          ...price,
          ...money_amount,
        }
      })
      // todo: implement actual price calculated_price when it's implemented in the pricing module
      variant.calculated_price = formattedPrices?.[0]?.amount || 1200
      variant.prices = formattedPrices
    })
  })
  return products
}
