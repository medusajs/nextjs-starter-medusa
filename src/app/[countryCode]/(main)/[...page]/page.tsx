import { Metadata } from "next"
import { notFound } from "next/navigation"

import BuilderWrapper from "@modules/common/components/builder-wrapper"
import { getBuilderContent } from "@lib/builder"
import { getRegion } from "@lib/data/regions"
import { listCollections } from "@lib/data/collections"

// Import Builder component registries
import "@modules/home/components/builder-registry"

interface BuilderPageProps {
  params: Promise<{
    countryCode: string
    page: string[]
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: BuilderPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { countryCode, page } = resolvedParams
  
  const urlPath = `/${page.join('/')}`
  
  // Fetch Builder content for metadata
  const builderContent = await getBuilderContent('page', {
    userAttributes: { urlPath, countryCode }
  })

  // Use Builder content metadata if available
  if (builderContent?.data) {
    return {
      title: builderContent.data.title || `${page.join(' ')} | Medusa Store`,
      description: builderContent.data.description || `${page.join(' ')} page`,
      openGraph: {
        title: builderContent.data.title || `${page.join(' ')} | Medusa Store`,
        description: builderContent.data.description || `${page.join(' ')} page`,
        images: builderContent.data.image ? [builderContent.data.image] : [],
      },
    }
  }

  return {
    title: `${page.join(' ')} | Medusa Store`,
    description: `${page.join(' ')} page`,
  }
}

export default async function BuilderPage({ params, searchParams }: BuilderPageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  
  const { countryCode, page } = resolvedParams
  const urlPath = `/${page.join('/')}`

  // Check if we're in preview mode
  const isPreview = 
    resolvedSearchParams['builder.preview'] === 'true' ||
    resolvedSearchParams['__builder_editing__'] === 'true'

  // Fetch Builder content
  const builderContent = await getBuilderContent('page', {
    userAttributes: { urlPath, countryCode },
    preview: isPreview
  })

  // If no Builder content and not in preview mode, return 404
  if (!builderContent && !isPreview) {
    return notFound()
  }

  // Fetch Medusa data that might be needed by Builder components
  const region = await getRegion(countryCode)
  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  // Prepare data for Builder components
  const builderData = {
    countryCode,
    region,
    collections,
    urlPath,
    // Add any other global data that Builder components might need
  }

  return (
    <BuilderWrapper
      model="page"
      content={builderContent}
      data={builderData}
    />
  )
}