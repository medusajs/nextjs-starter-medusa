import { ProductVariant } from "@medusajs/client-types"

export const canBuy = (variant: Omit<ProductVariant, "beforeInsert">) => {
  return variant.inventory_quantity > 0 || variant.allow_backorder === true
}
