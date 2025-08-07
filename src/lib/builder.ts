import { builder } from '@builder.io/sdk'

// Initialize Builder.io with your API key
const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY || 'YOUR_BUILDER_API_KEY'
let builderInitialized = false

function initializeBuilderIfNeeded() {
  if (!builderInitialized && BUILDER_API_KEY && BUILDER_API_KEY !== 'YOUR_BUILDER_API_KEY') {
    try {
      builder.init(BUILDER_API_KEY)
      builder.canTrack = false // Disable analytics tracking in development
      builderInitialized = true
      console.log('Builder.io initialized with API key:', BUILDER_API_KEY.substring(0, 10) + '...')
    } catch (error) {
      console.warn('Builder.io initialization failed:', error)
    }
  }
}

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
  // Skip Builder.io call if API key is not properly configured
  if (!BUILDER_API_KEY || BUILDER_API_KEY === 'YOUR_BUILDER_API_KEY') {
    console.log(`Skipping Builder.io call for model "${model}" - API key not configured`)
    return null
  }

  // Initialize Builder only when we actually need it
  initializeBuilderIfNeeded()

  if (!builderInitialized) {
    console.log(`Builder.io not initialized for model "${model}"`)
    return null
  }

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

    if (content) {
      console.log(`Successfully fetched Builder content for model "${model}"`)
    } else {
      console.log(`No Builder content found for model "${model}"`)
    }

    return content
  } catch (error: any) {
    if (error?.response?.status === 401) {
      console.error(`Builder.io API key is invalid or expired for model "${model}". Please check your API key.`)
    } else if (error?.response?.status === 404) {
      console.error(`Builder.io model "${model}" not found. Please create this model in your Builder.io space.`)
    } else {
      console.error(`Failed to fetch Builder content for model "${model}":`, error?.message || error)
    }
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