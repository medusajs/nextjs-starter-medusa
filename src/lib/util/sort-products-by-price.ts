import { HttpTypes } from "@medusajs/types"

interface PricedVariant extends HttpTypes.StoreProductVariant {
  calculated_price: {
    calculated_amount: number
  }
}

interface PricedProduct extends HttpTypes.StoreProduct {
  variants: PricedVariant[]
  _minPrice: number
}

/**
 * Helper function to sort products by price until the store API supports sorting by price
 * @param products
 * @param order
 * @returns products sorted by price
 */
export function sortProductsByPrice(
  products: HttpTypes.StoreProduct[],
  order: "asc" | "desc"
): PricedProduct[] {
  const pricedProducts = products as PricedProduct[]

  // Precompute the minimum price for each product
  pricedProducts.forEach((product) => {
    if (product.variants && product.variants.length > 0) {
      product._minPrice = Math.min(
        ...product.variants.map(
          (variant) => variant?.calculated_price?.calculated_amount
        )
      )
    } else {
      product._minPrice = Infinity
    }
  })

  // Sort products based on the precomputed minimum prices
  return pricedProducts.sort((a, b) => {
    const diff = a._minPrice - b._minPrice
    return order === "asc" ? diff : -diff
  })
}
