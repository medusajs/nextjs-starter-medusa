---
title: Feature Flags
description: Learn how to configure and use feature flags in the companion panel system
sidebar_position: 3
---

# Feature Flags

Feature flags allow you to enable/disable specific functionality in your Medusa Next.js Starter without code changes.

## Configuration

Edit `store.config.js` in your project root to enable or disable features:

```javascript
const storeConfig = {
  featureFlags: {
    // AI & Help Features
    aiCompanion: true,      // AI Shopping Assistant
    helpCompanion: true,    // Help & Documentation System
    
    // Commerce Features
    wishlist: false,        // Wishlist (coming soon)
    productCompare: false,  // Product Comparison (coming soon)
    reviews: false,         // Product Reviews (coming soon)
    
    // Additional Features
    analytics: false,       // Advanced Analytics
    notifications: false,   // Push Notifications
  }
}

module.exports = storeConfig
```

## Available Features

### Core Features (Always Available)

These features are always enabled and cannot be disabled:

- **Shopping Cart** - Core cart functionality
- **Product Filters** - Dynamic product filtering on store pages

### Optional Features

| Feature | Status | Description |
|---------|--------|-------------|
| `aiCompanion` | ✅ **Ready** | AI-powered shopping assistant with chat interface and ticket system |
| `helpCompanion` | ✅ **Ready** | Contextual help system with documentation and support resources |
| `wishlist` | 🚧 **Coming Soon** | Save products for later, wishlist management |
| `productCompare` | 🚧 **Coming Soon** | Side-by-side product comparison with detailed specifications |
| `reviews` | 🚧 **Coming Soon** | Product reviews, ratings, and user feedback |
| `analytics` | 📋 **Planned** | Advanced user behavior analytics and insights |
| `notifications` | 📋 **Planned** | Push notifications for cart abandonment, sales, etc. |

## Using Feature Flags

### In React Components

```typescript
import { isFeatureEnabled, getEnabledFeatures } from '@lib/config/companion-config'

function MyComponent() {
  // Check if a single feature is enabled
  const showAI = isFeatureEnabled('aiCompanion')
  
  // Get all enabled features
  const enabledFeatures = getEnabledFeatures()
  
  return (
    <div>
      {showAI && (
        <AIAssistantButton />
      )}
      
      {isFeatureEnabled('wishlist') && (
        <WishlistButton productId={product.id} />
      )}
    </div>
  )
}
```

### In Server Components

```typescript
// app/components/FeatureGate.tsx
import { isFeatureEnabled } from '@lib/config/companion-config'

interface FeatureGateProps {
  feature: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureGate({ feature, children, fallback = null }: FeatureGateProps) {
  if (!isFeatureEnabled(feature)) {
    return fallback
  }
  
  return children
}

// Usage in pages
<FeatureGate feature="productCompare">
  <ProductCompareWidget products={products} />
</FeatureGate>
```

### Dynamic Feature Loading

```typescript
// Lazy load feature components only when enabled
const AIAssistant = lazy(() => 
  isFeatureEnabled('aiCompanion') 
    ? import('@components/companion/AIAssistant')
    : Promise.resolve({ default: () => null })
)
```

## Environment-Specific Configuration

### Development vs Production

```javascript
// store.config.js
const isDev = process.env.NODE_ENV === 'development'

const storeConfig = {
  featureFlags: {
    aiCompanion: true,
    helpCompanion: true,
    
    // Enable debugging features only in development
    debugMode: isDev,
    devTools: isDev,
    
    // Enable experimental features in dev
    experimentalFeatures: isDev,
  }
}
```

### A/B Testing Setup

```javascript
// Advanced: A/B testing with feature flags
const getUserSegment = () => {
  // Your A/B testing logic here
  return Math.random() > 0.5 ? 'A' : 'B'
}

const storeConfig = {
  featureFlags: {
    // Standard features
    aiCompanion: true,
    
    // A/B test specific features
    newCheckoutFlow: getUserSegment() === 'A',
    enhancedSearch: getUserSegment() === 'B',
  }
}
```

## Best Practices

### 1. Gradual Rollouts

```javascript
// Roll out features to percentage of users
const rolloutPercentage = 25 // 25% of users

const storeConfig = {
  featureFlags: {
    newFeature: Math.random() * 100 < rolloutPercentage,
  }
}
```

### 2. Feature Dependencies

```javascript
// Some features depend on others
const aiEnabled = true
const advancedAI = aiEnabled && true // Only enable if AI is enabled

const storeConfig = {
  featureFlags: {
    aiCompanion: aiEnabled,
    aiRecommendations: advancedAI,
    aiAnalytics: advancedAI,
  }
}
```

### 3. Performance Considerations

```javascript
// Heavy features should be lazy-loaded
const storeConfig = {
  featureFlags: {
    // Lightweight features can be always loaded
    helpCompanion: true,
    
    // Heavy features should be code-split
    aiCompanion: true, // Lazy loaded only when needed
    analytics: false,  // Heavy analytics bundle
  }
}
```

## Debugging Feature Flags

### Development Tools

```typescript
// Add to your dev tools
if (process.env.NODE_ENV === 'development') {
  // Global debug function
  (window as any).debugFeatures = () => {
    console.log('Enabled features:', getEnabledFeatures())
    console.log('All flags:', getAllFeatureFlags())
  }
}
```

### Runtime Feature Toggle

```typescript
// Allow runtime toggling in development
if (process.env.NODE_ENV === 'development') {
  (window as any).toggleFeature = (feature: string) => {
    // Implementation for runtime toggling
    console.log(`Toggling ${feature}`)
  }
}
```

## Migration Guide

### Updating Feature Flags

When updating feature flags:

1. **Update the config**:
   ```javascript
   featureFlags: {
     oldFeature: false,  // Disable old feature
     newFeature: true,   // Enable new feature
   }
   ```

2. **Update component usage**:
   ```typescript
   // Old
   {isFeatureEnabled('oldFeature') && <OldComponent />}
   
   // New  
   {isFeatureEnabled('newFeature') && <NewComponent />}
   ```

3. **Clean up unused code** after features are stable

### Breaking Changes

Some feature flag changes may require code updates:

- Check the changelog for breaking changes
- Test thoroughly after updating flags
- Consider gradual rollouts for major features

## Next Steps

- [Configuration Examples](./examples)
- [Development Guide](../development/overview)
- [Troubleshooting](../troubleshooting/common-issues)