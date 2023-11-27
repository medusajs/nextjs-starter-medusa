"use client"

import { StoreGetProductsParams } from "@medusajs/medusa"
import { Heading, Text } from "@medusajs/ui"
import InfiniteProducts from "@modules/products/components/infinite-products"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import Link from "next/link"
import { useEffect, useState } from "react"

type SearchResultsTemplateProps = {
  query: string
  hits: Record<string, any>[]
}

const SearchResultsTemplate = ({ query, hits }: SearchResultsTemplateProps) => {
  const [params, setParams] = useState<StoreGetProductsParams>({})
  const [sortBy, setSortBy] = useState<SortOptions>("created_at")

  useEffect(() => {
    setParams({
      id: hits.map((h) => (h.hasOwnProperty("objectID") ? h.objectID : h.id)),
    })
  }, [hits])

  return (
    <div>
      <div className="flex justify-between border-b w-full py-6 px-8 small:px-14 items-center">
        <div className="flex flex-col items-start">
          <Text className="text-ui-fg-muted">Search Results for:</Text>
          <Heading>
            {query} ({hits.length})
          </Heading>
        </div>
        <Link
          href="/store"
          className="txt-medium text-ui-fg-subtle hover:text-ui-fg-base"
        >
          Clear
        </Link>
      </div>
      <div className="flex flex-col small:flex-row small:items-start py-6">
        {hits.length > 0 ? (
          <>
            <RefinementList
              refinementList={params}
              setRefinementList={setParams}
              sortBy={sortBy}
              setSortBy={setSortBy}
              search
            />
            <InfiniteProducts params={params} sortBy={sortBy} />
          </>
        ) : (
          <Text className="ml-8 small:ml-14 mt-3">No results.</Text>
        )}
      </div>
    </div>
  )
}

export default SearchResultsTemplate
