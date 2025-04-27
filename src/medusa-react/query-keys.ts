import { FindParams, HttpTypes, SelectParams } from "@medusajs/types"

// ----- Storefront Query Keys -----

export const storeKeys = {
  all: ["store"] as const,
  // Regions
  regions: {
    all: ["store", "regions"] as const,
    lists: () => ["store", "regions", "list"] as const,
    list: (query?: FindParams & HttpTypes.StoreRegionFilters) =>
      ["store", "regions", "list", query] as const,
    details: () => ["store", "regions", "detail"] as const,
    detail: (id: string, query?: SelectParams) =>
      ["store", "regions", "detail", id, query] as const,
  },
  // Collections
  collections: {
    all: ["store", "collections"] as const,
    lists: () => ["store", "collections", "list"] as const,
    list: (query?: FindParams & HttpTypes.StoreCollectionFilters) =>
      ["store", "collections", "list", query] as const,
    details: () => ["store", "collections", "detail"] as const,
    detail: (id: string, query?: SelectParams) =>
      ["store", "collections", "detail", id, query] as const,
  },
  // Categories
  categories: {
    all: ["store", "categories"] as const,
    lists: () => ["store", "categories", "list"] as const,
    list: (query?: FindParams & HttpTypes.StoreProductCategoryListParams) =>
      ["store", "categories", "list", query] as const,
    details: () => ["store", "categories", "detail"] as const,
    detail: (id: string, query?: HttpTypes.StoreProductCategoryParams) =>
      ["store", "categories", "detail", id, query] as const,
  },
  // Products
  products: {
    all: ["store", "products"] as const,
    lists: () => ["store", "products", "list"] as const,
    list: (query?: HttpTypes.StoreProductParams) =>
      ["store", "products", "list", query] as const,
    details: () => ["store", "products", "detail"] as const,
    detail: (id: string, query?: HttpTypes.StoreProductParams) =>
      ["store", "products", "detail", id, query] as const,
  },
  // Carts
  carts: {
    all: ["store", "carts"] as const,
    details: () => ["store", "carts", "detail"] as const,
    detail: (id: string, query?: SelectParams) =>
      ["store", "carts", "detail", id, query] as const,
  },
  // Shipping Options
  shippingOptions: {
    all: ["store", "shipping_options"] as const,
    lists: () => ["store", "shipping_options", "list"] as const,
    list: (query?: HttpTypes.StoreGetShippingOptionList) =>
      ["store", "shipping_options", "list", query] as const,
    cart: (query?: HttpTypes.StoreGetShippingOptionList) =>
      ["store", "shipping_options", "cart", query] as const,
  },
  // Payment Providers
  paymentProviders: {
    all: ["store", "payment_providers"] as const,
    lists: () => ["store", "payment_providers", "list"] as const,
    list: (query?: FindParams & HttpTypes.StorePaymentProviderFilters) =>
      ["store", "payment_providers", "list", query] as const,
  },
  // Orders
  orders: {
    all: ["store", "orders"] as const,
    lists: () => ["store", "orders", "list"] as const,
    list: (query?: HttpTypes.StoreOrderFilters) =>
      ["store", "orders", "list", query] as const,
    details: () => ["store", "orders", "detail"] as const,
    detail: (id: string, query?: SelectParams) =>
      ["store", "orders", "detail", id, query] as const,
  },
  // Customer (logged in)
  customer: {
    all: ["store", "customer"] as const,
    me: (query?: SelectParams) => ["store", "customer", "me", query] as const,
    addresses: {
      all: ["store", "customer", "addresses"] as const,
      lists: () => ["store", "customer", "addresses", "list"] as const,
      list: (query?: FindParams & HttpTypes.StoreCustomerAddressFilters) =>
        ["store", "customer", "addresses", "list", query] as const,
      details: () => ["store", "customer", "addresses", "detail"] as const,
      detail: (id: string, query?: SelectParams) =>
        ["store", "customer", "addresses", "detail", id, query] as const,
    },
  },
}
