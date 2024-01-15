import { Cart, ProductCategory, ProductVariant, Region } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { ProductCollection } from "@medusajs/product"

export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string
}

export type ProductPreviewType = {
  id: string
  title: string
  handle: string | null
  thumbnail: string | null
  created_at?: Date
  price?: {
    calculated_price: string
    original_price: string
    difference: string
    price_type: "default" | "sale"
  }
  isFeatured?: boolean
}

export type ProductCollectionWithPreviews = Omit<
  ProductCollection,
  "products"
> & {
  products: ProductPreviewType[]
}

export type InfiniteProductPage = {
  response: {
    products: PricedProduct[]
    count: number
  }
}

export type ProductVariantInfo = Pick<ProductVariant, "prices">

export type RegionInfo = Pick<Region, "currency_code" | "tax_code" | "tax_rate">

export type CartWithCheckoutStep = Omit<
  Cart,
  "beforeInsert" | "beforeUpdate" | "afterUpdateOrLoad"
> & {
  checkout_step: "address" | "delivery" | "payment"
}

export type ProductCategoryWithChildren = Omit<
  ProductCategory,
  "category_children"
> & {
  category_children: ProductCategory[]
  category_parent?: ProductCategory
}
