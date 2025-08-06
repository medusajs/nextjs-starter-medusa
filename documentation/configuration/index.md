# 🔧 Store Configuration System

## Overview

Simple, standard configuration system for managing optional companion panel features in your e-commerce theme. Uses a single JavaScript config file following Next.js conventions.

## 🎯 Key Benefits

- **Simple**: Single config file, standard JavaScript format
- **Type Safe**: Full TypeScript support
- **Standard**: Follows Next.js/React conventions
- **Focused**: Only configures optional features, not core functionality

## 📁 Configuration File

### Main Configuration
**Location**: `store.config.js` (project root)

Standard JavaScript configuration file that exports a simple object with feature flags and settings.

```javascript
// store.config.js
/** @type {import('./src/lib/config/types').StoreConfig} */
const storeConfig = {
  // Feature flags for optional companion panels
  featureFlags: {
    aiCompanion: true,      // AI Shopping Assistant
    helpCompanion: true,    // Help & Support
    wishlist: false,        // Wishlist feature (coming soon)
    productCompare: false,  // Product comparison (coming soon)
    reviews: false,         // Product reviews (coming soon)
  },

  // Layout and UI options
  layoutOptions: {
    maxVisibleButtons: 3,
    showLabels: false,
    showIcons: true,
    defaultPanelWidth: 400,
    maxPanelHistory: 10,
  },

  // Global system settings
  globalSettings: {
    enableKeyboardShortcuts: true,
    enableGestures: true,
    enableAnalytics: true,
  },

  // Development options
  development: {
    enableDebugMode: false,
    showPanelDemoButtons: false,
    logStateChanges: false,
  },
}

module.exports = storeConfig
```

## 🚀 Quick Start

### 1. Basic Feature Toggle

```typescript
import { isFeatureEnabled } from '@lib/config/companion-config'

// Check if a feature is enabled
if (isFeatureEnabled('aiCompanion')) {
  // Render AI assistant component
}
```

### 2. Get Enabled Features

```typescript
import { getEnabledFeatures } from '@lib/config/companion-config'

const enabledFeatures = getEnabledFeatures()
// Returns: ['aiCompanion', 'helpCompanion'] (based on config)
```

### 3. Layout Configuration

```typescript
import { getLayoutConfig } from '@lib/config/companion-config'

const layout = getLayoutConfig()
// Returns: { maxVisibleButtons: 3, showLabels: false, ... }
```

## 📋 Feature Categories

### Core Features (Always Enabled)
These features are essential to the theme and are always enabled:

| Feature | Key | Description | Location |
|---------|-----|-------------|----------|
| Shopping Cart | `cart` | E-commerce cart functionality | Always rendered in navigation |
| Product Filters | `filter` | Dynamic product filtering | Contextual to store/category pages |

### Optional Features (Configurable)
These features can be enabled/disabled via `store.config.js`:

| Feature | Key | Description | Default Status |
|---------|-----|-------------|----------------|
| AI Assistant | `aiCompanion` | AI-powered shopping help with chat and tickets | ✅ Enabled |
| Help System | `helpCompanion` | Support documentation and help resources | ✅ Enabled |
| Product Compare | `productCompare` | Side-by-side product comparison | ❌ Disabled (Coming Soon) |
| Wishlist | `wishlist` | Save for later functionality | ❌ Disabled (Coming Soon) |
| Reviews | `reviews` | Product reviews and ratings | ❌ Disabled (Coming Soon) |

## 🔧 Configuration API

### Helper Functions

```typescript
import { 
  isFeatureEnabled, 
  getEnabledFeatures, 
  getLayoutConfig,
  getGlobalSettings,
  getDevelopmentConfig 
} from '@lib/config/companion-config'

// Check individual features
const hasAI = isFeatureEnabled('aiCompanion')          // boolean
const hasHelp = isFeatureEnabled('helpCompanion')     // boolean

// Get collections
const enabled = getEnabledFeatures()                   // string[]
const layout = getLayoutConfig()                       // LayoutOptions
const global = getGlobalSettings()                     // GlobalSettings
const dev = getDevelopmentConfig()                     // DevelopmentOptions
```

### TypeScript Types

The system includes full TypeScript support:

```typescript
// src/lib/config/types.ts
export interface StoreConfig {
  featureFlags: {
    aiCompanion: boolean
    helpCompanion: boolean
    wishlist: boolean
    productCompare: boolean
    reviews: boolean
  }
  layoutOptions: {
    maxVisibleButtons: number
    showLabels: boolean
    showIcons: boolean
    defaultPanelWidth: number
    maxPanelHistory: number
  }
  globalSettings: {
    enableKeyboardShortcuts: boolean
    enableGestures: boolean
    enableAnalytics: boolean
  }
  development: {
    enableDebugMode: boolean
    showPanelDemoButtons: boolean
    logStateChanges: boolean
  }
}
```

## 🏗️ System Architecture

### Component Integration

The configuration system integrates with the companion panel system through several key components:

#### 1. Navigation Integration
```typescript
// src/modules/layout/templates/nav/index.tsx
import { ConfigurableCompanionTriggers } from '@modules/layout/components/configurable-companion-triggers'

// Cart is always rendered (core feature)
<CartButton />

// Optional features are rendered conditionally
<ConfigurableCompanionTriggers />
```

#### 2. Panel Rendering
```typescript
// src/modules/layout/components/resizable-companion-panel/index.tsx
const PanelComponents = {
  'cart': CartPanelContent,
  'filter': FilterPanelContent,
  'aiCompanion': AIAssistantPanelContent,
  'helpCompanion': HelpPanelContent,
}
```

#### 3. Context Integration
```typescript
// src/lib/context/companion-panel-context.tsx
import { isFeatureEnabled } from '@lib/config/companion-config'

// Core features bypass feature checks
const coreFeatures = ['cart', 'filter']
if (!coreFeatures.includes(type) && !isFeatureEnabled(type)) {
  console.warn(`Attempted to open disabled feature panel: ${type}`)
  return
}
```

## 🎛️ Configuration Options

### Layout Options
Control the appearance and behavior of the companion panel system:

```javascript
layoutOptions: {
  maxVisibleButtons: 3,        // Max buttons before overflow menu
  showLabels: false,           // Show text labels on buttons
  showIcons: true,            // Show icons on buttons
  defaultPanelWidth: 400,     // Default panel width (px)
  maxPanelHistory: 10,        // Max panels in history stack
}
```

### Global Settings
System-wide preferences:

```javascript
globalSettings: {
  enableKeyboardShortcuts: true,  // Enable keyboard navigation
  enableGestures: true,          // Enable touch gestures
  enableAnalytics: true,         // Enable usage tracking
}
```

### Development Options
Debug and development features:

```javascript
development: {
  enableDebugMode: false,        // Show debug information
  showPanelDemoButtons: false,   // Show panel demo controls
  logStateChanges: false,        // Log state changes to console
}
```

## 🚨 Best Practices

### 1. Configuration Management
- **Version Control**: Always commit `store.config.js` changes
- **Environment Consistency**: Keep configurations consistent across environments
- **Documentation**: Document any custom configuration changes

### 2. Feature Rollout
- **Test Locally**: Always test configuration changes locally first
- **Gradual Enablement**: Enable features for small user groups first
- **Monitor Performance**: Watch for performance impact of new features

### 3. Development Workflow
- **TypeScript**: Use the provided types for type safety
- **Feature Branches**: Use separate branches for configuration experiments
- **Code Reviews**: Review configuration changes like code changes

## 🔧 Troubleshooting

### Common Issues

#### Feature Not Appearing
1. Check if feature is enabled: `isFeatureEnabled('featureName')`
2. Verify the feature key matches exactly (e.g., `aiCompanion`, not `ai-assistant`)
3. Clear browser cache and restart development server
4. Check console for warnings about disabled features

#### Panel Content Not Loading
1. Verify panel component mapping in `ResizableCompanionPanel`
2. Check that component imports are correct
3. Ensure panel type keys are consistent throughout the system

#### Configuration Not Loading
1. Verify `store.config.js` syntax is valid JavaScript
2. Check that the file exports the config object correctly
3. Ensure TypeScript types match the configuration structure

### Debug Mode

Enable debug mode for detailed logging:

```javascript
development: {
  enableDebugMode: true,
  logStateChanges: true
}
```

This will show:
- Panel state changes in console
- Feature enablement status
- Component rendering information

## 📚 Related Documentation

- [Companion Panel System Overview](../COMPANION-PANEL-SYSTEM.md)
- [Component Architecture](../components/index.md)
- [State Management](../state-management/index.md)
- [Integration Guide](../integration/quick-start.md)

## 🔮 Future Enhancements

### Planned Features
- **Wishlist Panel**: Save products for later
- **Product Compare Panel**: Side-by-side product comparison
- **Reviews Panel**: Product reviews and ratings
- **User Preferences**: Per-user configuration overrides
- **Dynamic Loading**: Load panel components only when needed

### Migration Path
The system is designed to be backward-compatible. Future enhancements will maintain the same simple configuration structure while adding new optional features.