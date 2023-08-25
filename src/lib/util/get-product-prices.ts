import medusaRequest from "@lib/medusa-fetch"
import { ProductDTO, ProductVariantDTO } from "@medusajs/types/dist/product"

/**
 * Wourkaround to get variant prices until we release a dedicated pricing module
 * @param data Array of product objects (with variants) to get prices for
 * @param cartId (Optional) cart id to get region-specific prices
 */
export default async function getPrices(
  data: ProductDTO[],
  cartId?: string,
  regionId?: string
) {
  if (!data || !data.length) {
    return []
  }

  // Map of variant id to variant object
  const variantsById = new Map<string, Record<string, any>>()

  const productIds = data.map((p) => p.id)

  const query = {
    id: productIds,
    expand: "variants,variants.prices,variants.options",
  } as Record<string, any>

  if (cartId) {
    query.cart_id = cartId
  }

  if (regionId) {
    query.region_id = regionId
  }

  // Get all products with variants and prices from Medusa API
  const productsWithVariants = await medusaRequest("GET", `/products`, {
    query,
  }).then((res) => res.body.products)

  // Map all variants by id
  for (const product of productsWithVariants) {
    for (const variant of product.variants) {
      variantsById.set(variant.id, variant)
    }
  }

  // Map prices to variants
  const output = data.map((product) => {
    const variants = product.variants.map((v) => {
      const variant = variantsById.get(v.id)

      if (!variant) {
        return v
      }

      return variant as ProductVariantDTO
    })
    product.variants = variants
    return product
  })

  // Return products with prices
  return output
}
