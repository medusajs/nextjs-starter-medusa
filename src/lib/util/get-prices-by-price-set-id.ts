import { IPricingModuleService, CalculatedPriceSetDTO } from "@medusajs/types"

type Props = {
  products: any[]
  currency_code: string
  pricingService: IPricingModuleService
}

/**
 * Calculates the prices for a list of products, given a currency code.
 * @param products List of products to calculate prices for.
 * @param currency_code Currency code to calculate prices in.
 * @param pricingService Pricing service to use for calculating prices.
 * @returns The list of products with prices calculated.
 */
export async function getPricesByPriceSetId({
  products,
  currency_code,
  pricingService,
}: Props): Promise<typeof products> {
  for (const product of products) {
    for (const variant of product.variants) {
      const priceSetId = variant.price.price_set.id

      const [price] = (await pricingService.calculatePrices(
        { id: [priceSetId] },
        {
          context: { currency_code },
        }
      )) as unknown as CalculatedPriceSetDTO[]

      delete variant.price

      if (!price) continue

      variant.price = price
      variant.calculated_price = price.amount
    }
  }
  return products
}
