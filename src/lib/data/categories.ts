import { sdk } from "@lib/config"
import { cache } from "react"

export const listCategories = cache(async function () {
  return sdk.store.category
    .list({ fields: "+category_children" }, { next: { tags: ["categories"] } })
    .then(({ product_categories }) => product_categories)
})

export const getCategoriesList = cache(async function (
  offset: number = 0,
  limit: number = 100
) {
  return sdk.store.category.list(
    { limit, offset },
    { next: { tags: ["categories"] } }
  )
})

export const getCategoryByHandle = cache(async function (
  categoryHandle: string[]
) {
  const handles = categoryHandle.map((handle: string, index: number) =>
    categoryHandle.slice(0, index + 1).join("/")
  )

  return sdk.store.category.list(
    { handle: categoryHandle },
    { next: { tags: ["categories"] } }
  )
})
