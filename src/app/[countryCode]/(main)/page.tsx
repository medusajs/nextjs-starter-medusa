import { Metadata } from "next"
import { notFound } from "next/navigation"

import OriginalHomepage from "@modules/home/templates/original-homepage"
import BuilderWrapper from "@modules/common/components/builder-wrapper"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { getBuilderContent } from "@lib/builder"

// Import Builder component registry
import "@modules/home/components/builder-registry"

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

  // Check if we're in preview mode
  const isPreview = 
    searchParams['builder.preview'] === 'true' ||
    searchParams['__builder_editing__'] === 'true'

  // Fetch Builder content for homepage
  const builderContent = await getBuilderContent('page', {
    userAttributes: { 
      urlPath: '/',
      countryCode 
    },
    preview: isPreview
  })

  // Prepare data for Builder components
  const builderData = {
    collections,
    region,
    countryCode,
    // Add any other data that Builder components might need
  }

  return (
    <BuilderWrapper
      model="page"
      content={builderContent}
      fallbackComponent={OriginalHomepage}
      fallbackProps={{ collections, region, countryCode }}
      data={builderData}
    />
  )
}
