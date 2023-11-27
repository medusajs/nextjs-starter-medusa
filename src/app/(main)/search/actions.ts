"use server"

import { searchClient, SEARCH_INDEX_NAME } from "@lib/search-client"

/**
 * Uses MeiliSearch or Algolia to search for a query
 * @param {string} query - search query
 */
export async function search(query: string) {
  // MeiliSearch
  const queries = [{ params: { query }, indexName: SEARCH_INDEX_NAME }]
  const { results } = (await searchClient.search(queries)) as Record<
    string,
    any
  >
  const { hits } = results[0]

  // In case you want to use Algolia instead of MeiliSearch, uncomment the following lines and delete the above lines.

  // const index = searchClient.initIndex(SEARCH_INDEX_NAME)
  // const { hits } = await index.search(query)

  return hits
}
