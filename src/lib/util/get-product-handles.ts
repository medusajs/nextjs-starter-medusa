import { medusaClient } from "../config"

export const getProductHandles = async (): Promise<string[]> => {
  const data = await medusaClient.products
    .list({ limit: 100 })
    .then(({ products }) => {
      return products.map(({ handle }) => handle)
    })

  return data
}
