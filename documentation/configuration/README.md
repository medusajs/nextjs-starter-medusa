# 🔧 Store Configuration System - Quick Reference

## 📁 File Location
```
store.config.js  (project root)
```

## 🚀 Quick Setup

1. **Edit configuration** in `store.config.js`
2. **Import helpers** from `@lib/config/companion-config`  
3. **Use in components** with simple function calls

## ⚡ Most Common Usage

```typescript
import { isFeatureEnabled } from '@lib/config/companion-config'

// Check if feature is enabled
if (isFeatureEnabled('aiCompanion')) {
  // Render AI assistant button/panel
}
```

## 🎛️ Available Features

| Feature | Key | Status | Description |
|---------|-----|---------|-------------|
| **AI Assistant** | `aiCompanion` | ✅ Ready | Chat & ticket system |
| **Help System** | `helpCompanion` | ✅ Ready | Documentation & support |
| **Wishlist** | `wishlist` | 🚧 Coming Soon | Save for later |
| **Product Compare** | `productCompare` | 🚧 Coming Soon | Side-by-side comparison |
| **Reviews** | `reviews` | 🚧 Coming Soon | Product reviews |

**Core Features** (always enabled): `cart`, `filter`

## 📋 Configuration Structure

```javascript
// store.config.js
const storeConfig = {
  featureFlags: {
    aiCompanion: true,      // Enable/disable AI assistant
    helpCompanion: true,    // Enable/disable help system
    wishlist: false,        // Enable/disable wishlist
    productCompare: false,  // Enable/disable product compare
    reviews: false,         // Enable/disable reviews
  },
  
  layoutOptions: {
    maxVisibleButtons: 3,   // Max buttons in nav before overflow
    showLabels: false,      // Show text labels on buttons
    showIcons: true,        // Show icons on buttons
    defaultPanelWidth: 400, // Default panel width (px)
    maxPanelHistory: 10,    // Max panels in history stack
  },
  
  globalSettings: {
    enableKeyboardShortcuts: true,  // Keyboard navigation
    enableGestures: true,          // Touch gestures
    enableAnalytics: true,         // Usage tracking
  },
  
  development: {
    enableDebugMode: false,        // Debug information
    showPanelDemoButtons: false,   // Demo controls
    logStateChanges: false,        // Console logging
  },
}

module.exports = storeConfig
```

## 🔧 Helper Functions

```typescript
import { 
  isFeatureEnabled,     // Check single feature
  getEnabledFeatures,   // Get array of enabled features
  getLayoutConfig,      // Get layout options
  getGlobalSettings,    // Get global settings
  getDevelopmentConfig  // Get development options
} from '@lib/config/companion-config'

// Examples
const hasAI = isFeatureEnabled('aiCompanion')           // boolean
const enabled = getEnabledFeatures()                    // ['aiCompanion', 'helpCompanion']
const layout = getLayoutConfig()                        // { maxVisibleButtons: 3, ... }
```

## 🎯 Common Patterns

### Conditional Rendering
```typescript
{isFeatureEnabled('aiCompanion') && (
  <AIAssistantButton />
)}
```

### Dynamic Lists
```typescript
const enabledFeatures = getEnabledFeatures()
return (
  <div>
    {enabledFeatures.map(feature => (
      <FeatureButton key={feature} type={feature} />
    ))}
  </div>
)
```

### Layout-Aware Components
```typescript
const layout = getLayoutConfig()
const features = getEnabledFeatures().slice(0, layout.maxVisibleButtons)
```

## 🚨 Important Notes

- **Core features** (`cart`, `filter`) are always enabled
- **Optional features** can be toggled via `featureFlags`
- **Panel keys** must match exactly: `aiCompanion` not `ai-assistant`
- **TypeScript support** included for all configuration types

## 📚 Full Documentation

For complete details, see [Configuration Documentation](./index.md)