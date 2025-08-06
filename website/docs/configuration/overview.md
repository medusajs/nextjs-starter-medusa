---
title: Configuration Overview
description: Learn how to configure the Medusa Next.js Starter and Companion Panel System
sidebar_position: 1
---

# Configuration Overview

The Medusa Next.js Starter provides flexible configuration through the `store.config.js` file and environment variables.

## Store Configuration

The companion panel system configuration is managed via `store.config.js` in the project root:

```javascript
// store.config.js
const storeConfig = {
  featureFlags: {
    aiCompanion: true,      // AI Shopping Assistant
    helpCompanion: true,    // Help & Support System
    wishlist: false,        // Wishlist (coming soon)
    productCompare: false,  // Product Compare (coming soon)
    reviews: false,         // Reviews (coming soon)
  },
  
  layoutOptions: {
    maxVisibleButtons: 3,   // Max buttons in navigation
    showLabels: false,      // Show text labels
    showIcons: true,        // Show icons
    defaultPanelWidth: 400, // Panel width (px)
  },
}

module.exports = storeConfig
```

## Feature Flags

| Feature | Default | Description |
|---------|---------|-------------|
| `aiCompanion` | `true` | AI-powered shopping assistant with chat and ticket system |
| `helpCompanion` | `true` | Contextual documentation and support resources |
| `wishlist` | `false` | Save products for later (coming soon) |
| `productCompare` | `false` | Side-by-side product comparison (coming soon) |
| `reviews` | `false` | Product reviews and ratings (coming soon) |

## Layout Options

| Option | Default | Description |
|--------|---------|-------------|
| `maxVisibleButtons` | `3` | Maximum buttons shown in companion navigation |
| `showLabels` | `false` | Display text labels on navigation buttons |
| `showIcons` | `true` | Display icons on navigation buttons |
| `defaultPanelWidth` | `400` | Default panel width in pixels |

## Environment Variables

Create a `.env.local` file with the following variables:

```shell
# Stripe Payment Integration
NEXT_PUBLIC_STRIPE_KEY=<your-stripe-public-key>

# Medusa Backend
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# Other optional configurations...
```

## Usage in Components

```typescript
import { isFeatureEnabled, getEnabledFeatures } from '@lib/config/companion-config'

// Check if feature is enabled
if (isFeatureEnabled('aiCompanion')) {
  // Render AI companion features
}

// Get all enabled features
const features = getEnabledFeatures()
console.log(features) // ['aiCompanion', 'helpCompanion']
```

## Next Steps

- [Environment Setup](./environment-setup)
- [Feature Flags](./feature-flags) 
- [Configuration Examples](./examples)