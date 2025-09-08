import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCollectionByHandle, listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { StoreCollection } from "@medusajs/types"
import CollectionTemplate from "@modules/collections/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{
    page?: string
    sortBy?: SortOptions
  }>
}

export const PRODUCT_LIMIT = 12

export async function generateStaticParams() {
  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections) {
    return []
  }

  // Return basic params for collections, countryCode will be handled by middleware
  return collections
    .filter((collection) => collection.handle)
    .map((collection) => ({
      countryCode: "us", // Default, will be overridden by middleware
      handle: collection.handle!,
    }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const collection = await getCollectionByHandle(params.handle).catch(() => null)

  if (!collection) {
    notFound()
  }

  return {
    title: `${collection.title} | Kedişli Sevimli Çanta Atölyesi`,
    description: `${collection.title} koleksiyonundaki ürünleri keşfedin. El yapımı sevimli çantalar ve aksesuarlar.`,
  }
}

export default async function CollectionPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const collection = await getCollectionByHandle(params.handle).catch(() => null)

  if (!collection) {
    notFound()
  }

  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  return (
    <CollectionTemplate
      collection={collection}
      page={page}
      sortBy={sortBy}
      countryCode={params.countryCode}
    />
  )
}
