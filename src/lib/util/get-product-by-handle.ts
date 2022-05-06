import { medusaClient } from "../config"

export const getProductByHandle = async (handle: string) => {
  const data = await medusaClient.products
    .list({ handle })
    .then(({ products }) => products)

  const product = data[0]

  if (!product) {
    throw new Error(`Product with handle ${handle} not found`)
  }

  return product
}
