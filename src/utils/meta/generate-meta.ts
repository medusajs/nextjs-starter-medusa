import { mergeOpenGraph } from "@/utils/meta/open-graph"

import type { Metadata } from "next"

export const generateMeta = async (doc: {
  meta: {
    title?: string
    description?: string
    image?: string
    [key: string]: any
  }
  slug?: string | string[]
}): Promise<Metadata> => {
  const title = doc?.meta?.title
    ? `${doc?.meta?.title} · ${process.env.NEXT_PUBLIC_SITE_NAME}`
    : process.env.NEXT_PUBLIC_SITE_NAME

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || "",
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join("/") : "/",
    }),
    title,
  }
}
