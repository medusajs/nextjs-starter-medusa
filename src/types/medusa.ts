import {
  LineItem,
  Merge,
  Order,
  Product,
  ProductOption,
  ProductVariant,
  SetRelation,
  ShippingMethod,
} from "@medusajs/client-types"

export type ProductWithVariantsWithOptions = Merge<SetRelation<Product, "variants" | "options">, {
  options: Array<SetRelation<ProductOption, "values">>
}>

export type CalculatedVariant = ProductVariant & {
  calculated_price: number
  calculated_price_type: "sale" | "default"
  original_price: number
}

/**
 * Subset of default relations from StoreCartsRes["order"] and StoreOrdersRes["order"]
 */
export type OrderWithRelations =
  Merge<SetRelation<Order, "items" | "region" | "shipping_methods" | "shipping_address" | "discount_total" | "gift_card_total">, {
    items: Array<Merge<SetRelation<LineItem, "variant">, {
      variant: SetRelation<ProductVariant, "product">
    }>>
    shipping_methods: Array<SetRelation<ShippingMethod, "shipping_option">>
  }>

/**
 * Subset of default relations from StoreCartsRes["order"]["items"] and StoreOrdersRes["order"]["items"]
 */
export type LineItemWithRelations = Merge<SetRelation<LineItem, "variant">, {
  variant: SetRelation<ProductVariant, "product">
}>

/**
 * Subset of default relations from StoreProductsListRes["products"]
 */
export type ProductWithRelations = Merge<SetRelation<Product, "variants" | "options" | "images" | "tags">, {
  variants: Array<SetRelation<ProductVariant, "options" | "prices">>
  options: Array<SetRelation<ProductOption, "values">>
}>