import { Metadata } from "next"

import { getI18n, setStaticParams } from "../../../../locales/server"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "store.products.title",
  description: "store.products.desc",
}

type Params = {
  searchParams: {
    sortBy?: SortOptions
    page?: string
  }
  params: {
    countryCode: string
  }
}

export default async function StorePage({ searchParams, params }: Params) {
  setStaticParams(params.countryCode)
  const t = await getI18n()
  metadata.title = t("store.products.title")
  metadata.description = t("store.products.desc")

  const { sortBy, page } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}
