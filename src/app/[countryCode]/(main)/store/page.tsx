import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import {
  parsePlpViewMode,
  resolveStorePlpViewConfig,
} from "@modules/store/lib/plp-view-config"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    q?: string
    view?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, q, view } = searchParams
  const viewConfig = resolveStorePlpViewConfig()
  const viewMode = parsePlpViewMode(view, viewConfig)

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      q={q}
      viewMode={viewMode}
      viewConfig={viewConfig}
      countryCode={params.countryCode}
    />
  )
}
