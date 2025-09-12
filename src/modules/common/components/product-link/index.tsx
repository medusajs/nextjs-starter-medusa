"use client"

import React, { useMemo } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useFrom } from "@lib/context/from-context"

type ProductLinkProps = {
  productHandle: string
  className?: string
  children?: React.ReactNode
}

const ProductLink: React.FC<ProductLinkProps> = ({ productHandle, className, children }) => {
  const { from } = useFrom()

  const href = useMemo(() => {
    const base = `/products/${productHandle}`
    if (from?.href && from?.label) {
      const params = new URLSearchParams({ from: from.href, fromLabel: from.label })
      return `${base}?${params.toString()}`
    }
    return base
  }, [productHandle, from])

  return (
    <LocalizedClientLink href={href} className={className}>
      {children}
    </LocalizedClientLink>
  )
}

export default ProductLink


