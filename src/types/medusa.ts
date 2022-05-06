import { Product as MedusaProduct, ProductVariant, Region as MedusaRegion } from "@medusajs/medusa"

export type Variant = Omit<ProductVariant, "beforeInsert">

export interface Product extends Omit<MedusaProduct, "variants"> {
  variants: Variant[]
}

export interface Region extends Omit<MedusaRegion, "beforeInsert"> {}