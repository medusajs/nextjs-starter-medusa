import { Metadata } from "next"
import { notFound } from "next/navigation"

import OriginalHomepage from "@modules/home/templates/original-homepage"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams

  const { countryCode } = params

  // Fetch Medusa data
  const region = await getRegion(countryCode)
  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return notFound()
  }

  return (
    <OriginalHomepage 
      collections={collections} 
      region={region} 
      countryCode={countryCode} 
    />
  )
}
