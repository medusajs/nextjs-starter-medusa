import { Product } from "./medusa"

export type CollectionData = {
  id: string
  title: string
}

export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string
}

export type StoreNavData = {
  collections: CollectionData[]
  hasMoreCollections: boolean
  featuredProducts: Product[]
}

// page props for store pages (products and collection pages)
export type StoreProps<T extends unknown, K extends unknown> = {
  page: {
    data: T
    additionalData: K
  }
  site: {
    navData: StoreNavData
  }
}

// page props for non-store pages (home, about, contact, etc)
export type SiteProps = {
  site: {
    navData: StoreNavData
  }
}
