import { builder } from '@builder.io/sdk'

// Initialize Builder.io with your API key
// Replace with your actual Builder.io API key
const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY || 'YOUR_BUILDER_API_KEY'

if (!BUILDER_API_KEY || BUILDER_API_KEY === 'YOUR_BUILDER_API_KEY') {
  console.warn('Builder.io API key not found. Please set NEXT_PUBLIC_BUILDER_API_KEY in your environment variables.')
}

builder.init(BUILDER_API_KEY)

// Configure Builder.io settings
builder.canTrack = false // Disable analytics tracking in development

export { builder }

// Helper function to check if we're in Builder preview mode
export function isBuilderPreview(searchParams: URLSearchParams): boolean {
  return (
    searchParams.has('builder.preview') ||
    searchParams.has('__builder_editing__') ||
    searchParams.has('builder.frameEditing')
  )
}

// Helper function to get Builder content with error handling
export async function getBuilderContent(
  model: string,
  options: {
    userAttributes?: Record<string, any>
    query?: Record<string, any>
    locale?: string
    preview?: boolean
  } = {}
) {
  try {
    const content = await builder
      .get(model, {
        userAttributes: options.userAttributes || {},
        query: options.query,
        locale: options.locale,
        prerender: !options.preview,
        cachebust: options.preview,
      })
      .toPromise()

    return content
  } catch (error) {
    console.error(`Failed to fetch Builder content for model "${model}":`, error)
    return null
  }
}

// Types for Builder content
export interface BuilderContent {
  id: string
  name: string
  data: Record<string, any>
  content: any
}