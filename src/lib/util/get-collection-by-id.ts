import { medusaClient } from "../config"

// Currently implemented using id as we do not allow filtering list of collections by handle
export const getCollectionById = async (id: string) => {
  const data = await medusaClient.collections
    .retrieve(id)
    .then(({ collection }) => collection)
    .catch(() => undefined)

  if (!data) {
    throw new Error(`Collection with handle ${id} not found`)
  }

  return data
}
