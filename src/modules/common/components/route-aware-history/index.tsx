"use client"

import React, { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useInternalHistory } from "@lib/context/internal-history-context"

// Best-effort label detection by route. Page-level templates can still refine via a custom event if needed.
const detect = (pathname: string, searchParams: URLSearchParams): { href: string; label: string; pageType?: string } => {
  // Strip country code prefix: /{cc}/...
  const parts = pathname.split("/").filter(Boolean)
  const normalized = parts.length > 1 ? "/" + parts.slice(1).join("/") : "/"

  if (normalized === "/" || normalized === "/home") return { href: normalized, label: "Home", pageType: "home" }
  if (normalized.startsWith("/store")) return { href: normalized, label: "Store", pageType: "store" }
  if (normalized.startsWith("/categories/")) return { href: normalized, label: "Category", pageType: "category" }
  if (normalized.startsWith("/collections/")) return { href: normalized, label: "Collection", pageType: "collection" }
  if (normalized.startsWith("/cart")) return { href: normalized, label: "Cart", pageType: "other" }
  if (normalized.startsWith("/search")) {
    const q = searchParams.get("q")
    return { href: `${normalized}${q ? `?q=${encodeURIComponent(q)}` : ""}`, label: q ? `Search: ${q}` : "Search", pageType: "search" }
  }
  if (normalized.startsWith("/products/")) return { href: normalized, label: "Product", pageType: "pdp" }
  return { href: normalized, label: "Page", pageType: "other" }
}

const RouteAwareHistory: React.FC = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { push, replaceLast } = useInternalHistory()

  useEffect(() => {
    if (!pathname) return
    const { href, label, pageType } = detect(pathname, searchParams)
    // Replace ephemeral entries for same path; otherwise push
    replaceLast({ href, label, pageType })
  }, [pathname, searchParams, replaceLast])

  return null
}

export default RouteAwareHistory



