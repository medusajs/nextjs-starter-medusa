// Central Builder.io component registry
// This file imports all individual component registries to ensure they're loaded

// Import all component registries
import '@modules/home/components/builder-registry'
import '@modules/products/components/builder-registry'
import '@modules/store/components/builder-registry'

// Initialize Builder.io
import { builder } from './builder'

// Additional global Builder.io configuration
builder.canTrack = false // Disable analytics in development

// Export initialization function
export function initializeBuilderComponents() {
  console.log('All Builder.io components registered')
  
  // Log registered components for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('Builder.io initialized with API key:', process.env.NEXT_PUBLIC_BUILDER_API_KEY ? 'Set' : 'Not set')
  }
}