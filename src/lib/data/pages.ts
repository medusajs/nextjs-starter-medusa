"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

type Page = {
  id: string
  title: string
  slug: string
  content?: string | null
  excerpt?: string | null
  featured_image?: string | null
  seo_title?: string | null
  seo_description?: string | null
  status: "draft" | "published"
  is_public: boolean
  metadata?: Record<string, unknown> | null
}

type PagesResponse = {
  pages: Page[]
  count: number
  limit: number
  offset: number
}

type PageResponse = {
  page: Page
}

export const listPages = async ({
  limit = 20,
  offset = 0,
  q,
}: {
  limit?: number
  offset?: number
  q?: string
}) => {
  const next = {
    ...(await getCacheOptions("pages")),
  }

  return sdk.client.fetch<PagesResponse>("/store/pages", {
    method: "GET",
    query: {
      limit,
      offset,
      q,
    },
    next,
    cache: "force-cache",
  })
}

export const retrievePageBySlug = async (slug: string) => {
  const next = {
    ...(await getCacheOptions(`page-${slug}`)),
  }

  return sdk.client
    .fetch<PageResponse>(`/store/pages/${slug}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ page }) => page)
    .catch(() => null)
}
