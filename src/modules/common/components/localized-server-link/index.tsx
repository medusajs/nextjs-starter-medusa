import Link from "next/link"
import React from "react"

import { headers } from "next/headers"

export default async function LocalizedClientLink({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  [x: string]: any
}) {
  const nextHeaders = headers()
  const host = nextHeaders.get("host") || ""
  const referer = nextHeaders.get("referer") || ""

  return (
    <Link href={referer + href} {...props}>
      {children}
    </Link>
  )
}
