import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { ProductPreviewType } from "types/global"

const stripCurrency = (price: string) => {
  return parseFloat(price.replace(/[^0-9.]/g, ""))
}

const sortProducts = (products: ProductPreviewType[], sortBy: SortOptions) => {
  if (sortBy === "price_asc") {
    return products.sort((a, b) => {
      if (!a.price?.calculated_price || !b.price?.calculated_price) return 0

      return (
        stripCurrency(a.price?.calculated_price) -
        stripCurrency(b.price?.calculated_price)
      )
    })
  }

  if (sortBy === "price_desc") {
    return products.sort((a, b) => {
      if (!a.price?.calculated_price || !b.price?.calculated_price) return 0

      return (
        stripCurrency(b.price?.calculated_price) -
        stripCurrency(a.price?.calculated_price)
      )
    })
  }

  if (sortBy === "created_at") {
    return products.sort((a, b) => {
      if (!a.created_at || !b.created_at) return 0

      return new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf()
    })
  }

  return products
}

export default sortProducts
