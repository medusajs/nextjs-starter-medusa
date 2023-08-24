import medusaRequest from "@lib/medusa-fetch"
import { ProductDTO, ProductVariantDTO } from "@medusajs/types/dist/product"

/**
 * Wourkaround to get variant prices until we release a dedicated pricing module
 * @param data Array of product objects (with variants) to get prices for
 * @param cartId (Optional) cart id to get region-specific prices
 */
export default async function getVariants(data: ProductDTO[], cartId?: string) {
  if (!data || !data.length) {
    throw new Error("No products provided")
  }

  // Map of variant id to variant object
  const variantsById = new Map<string, Record<string, any>>()

  const query = {
    expand: "variants,variants.prices,variants.options",
  } as Record<string, string>

  if (cartId) {
    query.cart_id = cartId
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
