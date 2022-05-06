import { medusaClient } from "@lib/config"
import { Product } from "types/medusa"

const COL_LIMIT = 15

const getFeaturedProducts = async (): Promise<Product[]> => {
  const payload = {} as Record<string, unknown>

  if (process.env.FEATURED_PRODUCTS) {
    payload.id = process.env.FEATURED_PRODUCTS as string
  } else {
    payload.limit = 3
  }

  const products = await medusaClient.products
    .list(payload)
    .then(({ products }) => products)
    .catch((_) => [])

  return products
}

// get global data used in header and footer
const getGlobalData = async () => {
  let totalCount = 0

  const collections = await medusaClient.collections
    .list({ limit: COL_LIMIT })
    .then(({ collections, count }) => {
      totalCount = count
      return collections
    })
    .catch((_) => undefined)

  const featuredProducts = await getFeaturedProducts()

  return {
    navData: {
      hasMoreCollections: totalCount > COL_LIMIT,
      collections:
        collections?.map((c) => ({ id: c.id, title: c.title })) || [],
      featuredProducts,
    },
  }
}

export const getSiteData = async () => {
  const globalData = await getGlobalData()

  return {
    site: globalData,
  }
}

const getRelatedProducts = async (product: Product) => {
  const { id, type, tags, collection_id } = product

  const relatedProducts: Product[] = []

  // if product is in a collection, get products from that collection
  if (collection_id) {
    await medusaClient.products
      .list({ collection_id: [collection_id], limit: 11 })
      .then(({ products }) => relatedProducts.push(...products))
      .catch((err) => {
        if (process.env.NODE_ENV === "development") {
          console.error(
            "An error occured while fetching products related by collection:",
            err
          )
        }
      })
  }

  // if product has a type and we still don't have atleast 10 related products, get products of the same type
  if (relatedProducts.length < 11 && type) {
    await medusaClient.products
      .list({ type: type.value, limit: 11 })
      .then(({ products }) => relatedProducts.push(...products))
      .catch((err) => {
        if (process.env.NODE_ENV === "development") {
          console.error(
            "An error occured while fetching products related by type:",
            err
          )
        }
      })
  }

  if (relatedProducts.length < 11 && tags) {
    // if product has tags, get products with same tags
    await medusaClient.products
      .list({ tags: tags.map((t) => t.value), limit: 11 })
      .then(({ products }) => relatedProducts.push(...products))
      .catch((err) => {
        if (process.env.NODE_ENV === "development") {
          console.error(
            "An error occured while fetching products related by tags:",
            err
          )
        }
      })
  }

  // return up to 10 related products
  const result = relatedProducts.filter((rp) => rp.id !== id).slice(0, 9)

  return result
}

// get data for a specific product, as well as global data
export const getProductData = async (handle: string) => {
  const siteData = await getGlobalData()

  const data = await medusaClient.products
    .list({ handle })
    .then(({ products }) => products)

  const product = data[0]

  if (!product) {
    throw new Error(`Product with handle ${handle} not found`)
  }

  const relatedProducts = await getRelatedProducts(product)

  return {
    page: {
      data: product,
      additionalData: relatedProducts,
    },
    site: siteData,
  }
}

const getInitialProducts = async (collectionId: string) => {
  const result = await medusaClient.products
    .list({ collection_id: [collectionId], limit: 10 })
    .then(({ products, count }) => {
      return {
        initialProducts: products,
        count: count,
        hasMore: count > 10,
      }
    })
    .catch((_) => ({ initialProducts: [], count: 0, hasMore: false }))

  return result
}

// get data for a specific collection, as well as global data
export const getCollectionData = async (id: string) => {
  const siteData = await getGlobalData()

  const data = await medusaClient.collections
    .retrieve(id)
    .then(({ collection }) => collection)
    .catch(() => undefined)

  if (!data) {
    throw new Error(`Collection with handle ${id} not found`)
  }

  const additionalData = await getInitialProducts(id)

  return {
    page: {
      data,
      additionalData,
    },
    site: siteData,
  }
}
