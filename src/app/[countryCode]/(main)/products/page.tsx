import { Metadata } from "next"

import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export const metadata: Metadata = {
  title: "Tüm Ürünler | Kedişli Sevimli Çanta Atölyesi",
  description: "El yapımı sevimli çantalar ve aksesuarlar. Tüm ürünlerimizi keşfedin.",
}

export default async function ProductsPage(props: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { countryCode } = params
  const { sortBy, page } = searchParams

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const pageNumber = page ? parseInt(page as string) : 1
  const sort = (sortBy as SortOptions) || "created_at"

  return (
    <div className="content-container py-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-ui-fg-base mb-4">
          Tüm Ürünlerimiz
        </h1>
        <p className="text-lg text-ui-fg-subtle">
          El yapımı sevimli çantalar ve aksesuarlar
        </p>
      </div>
      
      <PaginatedProducts
        sortBy={sort}
        page={pageNumber}
        countryCode={countryCode}
      />
    </div>
  )
}

