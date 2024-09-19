import { Heading, Text } from "@medusajs/ui"
import Link from "next/link"

import { getI18n, getScopedI18n } from '../../../../locales/server'
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type SearchResultsTemplateProps = {
  query: string
  ids: string[]
  sortBy?: SortOptions
  page?: string
  countryCode: string
}

async function SearchResultsTemplate({
  query, ids, sortBy, page, countryCode,
}: SearchResultsTemplateProps) {
  const pageNumber = page ? parseInt(page) : 1
  const t = await getScopedI18n("search")

  return (
    <>
      <div className="flex justify-between border-b w-full py-6 px-8 small:px-14 items-center">
        <div className="flex flex-col items-start">
          <Text className="text-ui-fg-muted">{t("searchresults")}</Text>
          <Heading>
            {decodeURI(query)} ({ids.length})
          </Heading>
        </div>
        <LocalizedClientLink
          href="/store"
          className="txt-medium text-ui-fg-subtle hover:text-ui-fg-base"
        >
          {t("clear")}
        </LocalizedClientLink>
      </div>
      <div className="flex flex-col small:flex-row small:items-start p-6">
        {ids.length > 0 ? (
          <>
            <RefinementList sortBy={sortBy || "created_at"} search />
            <div className="content-container">
              <PaginatedProducts
                productsIds={ids}
                sortBy={sortBy}
                page={pageNumber}
                countryCode={countryCode} />
            </div>
          </>
        ) : (
          <Text className="ml-8 small:ml-14 mt-3">{t("noresults")}</Text>
        )}
      </div>
    </>
  )
}

export default SearchResultsTemplate
