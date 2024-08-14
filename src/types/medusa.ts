import { Region as MedusaRegion, ProductVariant } from "@medusajs/medusa"

export type Variant = Omit<ProductVariant, "beforeInsert">

export interface Region extends Omit<MedusaRegion, "beforeInsert"> {}

export type CalculatedVariant = ProductVariant & {
  calculated_price: number
  calculated_price_type: "sale" | "default"
  original_price: number
  original_price_incl_tax: number
  original_price_incl_tax_number: number

}
