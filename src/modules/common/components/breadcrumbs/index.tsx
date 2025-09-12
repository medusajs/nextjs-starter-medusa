"use client"

import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { useSearchParams } from "next/navigation"
import { useInternalHistory } from "@lib/context/internal-history-context"

export type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbsProps =
  | {
      items: BreadcrumbItem[]
      className?: string
      ariaLabel?: string
      category?: never
      product?: never
    }
  | {
      items?: undefined
      className?: string
      ariaLabel?: string
      category: HttpTypes.StoreProductCategory
      product?: never
    }
  | {
      items?: undefined
      className?: string
      ariaLabel?: string
      category?: never
      product: HttpTypes.StoreProduct
    }

const Breadcrumbs: React.FC<BreadcrumbsProps> = (props) => {
  const ariaLabel = props.ariaLabel ?? "Breadcrumb"

  const buildFromCategory = (
    category: HttpTypes.StoreProductCategory
  ): BreadcrumbItem[] => {
    const parents: HttpTypes.StoreProductCategory[] = []
    const collectParents = (cat?: HttpTypes.StoreProductCategory | null) => {
      if (!cat || !cat.parent_category) return
      parents.push(cat.parent_category)
      collectParents(cat.parent_category)
    }
    collectParents(category)
    const parentItems: BreadcrumbItem[] = parents
      .slice()
      .reverse()
      .map((p) => ({ label: p.name, href: `/categories/${p.handle}` }))

    return [{ label: "Home", href: "/" }, ...parentItems, { label: category.name }]
  }

  const buildFromProduct = (product: HttpTypes.StoreProduct): BreadcrumbItem[] => {
    // Read search params at top-level of component to honor React hooks rules
    const selectedCategory = product?.categories && product.categories.length > 0 ? product.categories[0] : undefined
    const categoryTrail = selectedCategory ? buildFromCategory(selectedCategory as any) : [{ label: "Home", href: "/" }]
    return [...categoryTrail, { label: product.title }]
  }

  // Read query params once per render and use if present on product pages
  const params = useSearchParams()

  let items: BreadcrumbItem[] | undefined
  if ("items" in props && props.items) {
    items = props.items
  } else if ("category" in props && props.category) {
    items = buildFromCategory(props.category)
  } else if ("product" in props && props.product) {
    const { history } = useInternalHistory()
    const fromParam = params?.get("from") || undefined
    const fromLabelParam = params?.get("fromLabel") || undefined
    const lastListing = [...history].reverse().find((h) => h.pageType === "store" || h.pageType === "category" || h.pageType === "collection" || h.pageType === "search")

    if (fromParam && fromLabelParam) {
      items = [
        { label: "Home", href: "/" },
        { label: fromLabelParam, href: fromParam },
        { label: props.product.title },
      ]
    } else if (lastListing) {
      items = [
        { label: "Home", href: "/" },
        { label: lastListing.label, href: lastListing.href },
        { label: props.product.title },
      ]
    } else {
      items = buildFromProduct(props.product)
    }
  }

  if (!items || items.length === 0) {
    return null
  }

  return (
    <nav aria-label={ariaLabel} className={props.className}>
      <ol className="flex flex-wrap items-center gap-2 text-small-regular text-ui-fg-subtle">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {isLast || !item.href ? (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "text-ui-fg-base" : undefined}>
                  {item.label}
                </span>
              ) : (
                <LocalizedClientLink href={item.href} className="hover:text-ui-fg-base">
                  {item.label}
                </LocalizedClientLink>
              )}
              {!isLast && <span className="mx-2 text-ui-fg-muted">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs


