"use server"

import { searchClient, SEARCH_INDEX_NAME } from "@lib/search-client"

/**
 * Uses Algolia to search for a query
 * @param {string} query - search query
 */
export async function search(query: string) {
  const index = searchClient.initIndex(SEARCH_INDEX_NAME)
  const { hits } = await index.search(query)
  return hits
}
