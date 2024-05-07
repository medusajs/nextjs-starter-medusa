import { newClient } from "@lib/config"
import { cache } from "react"
import { ProductCategoryWithChildren } from "types/global"

export const listCategories = cache(async function () {
  return newClient.store.category
    .list({ fields: "+category_children" }, { next: { tags: ["categories"] } })
    .then(({ product_categories }) => product_categories)
})

export const getCategoriesList = cache(async function (
  offset: number = 0,
  limit: number = 100
): Promise<{
  product_categories: ProductCategoryWithChildren[]
  count: number
}> {
  return newClient.store.category
    .list({ limit, offset }, { next: { tags: ["categories"] } })
    .then(({ product_categories, count }) => ({
      product_categories,
      count,
    }))
})

export const getCategoryByHandle = cache(async function (
  categoryHandle: string[]
): Promise<{
  product_categories: ProductCategoryWithChildren[]
}> {
  const handles = categoryHandle.map((handle: string, index: number) =>
    categoryHandle.slice(0, index + 1).join("/")
  )

  return newClient.store.category
    .list({ handle: categoryHandle }, { next: { tags: ["categories"] } })
    .then(({ product_categories }) => product_categories)
})
