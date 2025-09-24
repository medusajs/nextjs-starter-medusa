"use client"

import Link from "next/link"
import { useParams } from "next/navigation"

import type { ComponentProps } from "react"

function LocalizedClientLink({ href, ...props }: ComponentProps<typeof Link>) {
  const { countryCode } = useParams()

  return <Link href={`/${countryCode}${href}`} {...props} />
}

export { LocalizedClientLink }
