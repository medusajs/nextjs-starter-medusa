import { medusaClient } from "@lib/config"
import { Product, StoreGetProductsParams } from "@medusajs/medusa"

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

// get data for a specific product, as well as global data
export const getProductData = async (handle: string) => {
  const data = await medusaClient.products
    .list({ handle })
    .then(({ products }) => products)

  const product = data[0]

  if (!product) {
    throw new Error(`Product with handle ${handle} not found`)
  }

  return {
    page: {
      data: product,
    },
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

type FetchProductListParams = {
  pageParam?: number
  queryParams: StoreGetProductsParams
}

export const fetchProductsList = async ({
  pageParam = 0,
  queryParams,
}: FetchProductListParams) => {
  const { products, count, offset } = await medusaClient.products.list({
    limit: 12,
    offset: pageParam,
    ...queryParams,
  })

  return {
    response: { products, count },
    nextPage: count > offset + 12 ? offset + 12 : null,
  }
}
