import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products-dropdown"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    tags?: string
    types?: string
    materials?: string
    sizes?: string
    price_min?: string
    price_max?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, tags, types, materials, sizes, price_min, price_max } = searchParams

  const filterParams = {
    tags,
    types,
    materials,
    sizes,
    price_min,
    price_max,
  }

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      searchParams={filterParams}
    />
  )
}
