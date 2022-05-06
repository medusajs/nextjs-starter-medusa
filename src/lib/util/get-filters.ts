import { medusaClient } from "../config"

export type CollectionFilters = { [filter: string]: string[] }

export const getFilters = async (
  collectionId: string
): Promise<CollectionFilters> => {
  const products = await medusaClient.products
    .list({ collection_id: [collectionId], limit: 100 })
    .then(({ products }) => products)

  const filters: CollectionFilters = {}

  products.forEach((product) => {
    product.options.forEach((option) => {
      const { title, values } = option
      if (!filters[title]) {
        filters[title] = []
      }
      values.forEach((value) => {
        if (!filters[title].includes(value.value)) {
          filters[title].push(value.value)
        }
      })
    })
  })

  return filters
}
