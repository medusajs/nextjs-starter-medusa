---
title: Configuration Overview
description: Complete guide to configuring the companion panel system
sidebar_position: 1
---

# ⚙️ Configuration Overview

The Companion Panel System is highly configurable to meet your specific e-commerce needs. Configuration is managed through the `store.config.js` file and environment variables.

## Quick Configuration

### Basic Setup

```javascript
// store.config.js
export const companionPanelConfig = {
  // Core panels (always available)
  enabledPanels: ['cart', 'filter'],
  
  // Optional panels
  optionalPanels: ['aiCompanion', 'helpCompanion'],
  
  // Default panel to show
  defaultPanel: 'cart',
  
  // Panel behavior
  autoClose: false,
  historyLimit: 10,
}
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_COMPANION_PANELS_ENABLED=true
NEXT_PUBLIC_AI_COMPANION_ENABLED=true
NEXT_PUBLIC_HELP_SYSTEM_ENABLED=true
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

## Panel Configuration

### Core Panels

**Cart Panel** (always enabled)
```javascript
cart: {
  enabled: true,
  showMiniCart: true,
  autoOpen: false,
  persistCart: true,
}
```

**Filter Panel** (contextual to store pages)
```javascript
filter: {
  enabled: true,
  showOnPages: ['/store', '/products', '/categories'],
  defaultFilters: ['price', 'category', 'brand'],
  rememberFilters: true,
}
```

### Optional Panels

**AI Companion**
```javascript
aiCompanion: {
  enabled: process.env.NEXT_PUBLIC_AI_COMPANION_ENABLED === 'true',
  provider: 'openai', // 'openai' | 'anthropic' | 'custom'
  model: 'gpt-4',
  features: ['chat', 'recommendations', 'support'],
  contextAware: true,
}
```

**Help Companion**
```javascript
helpCompanion: {
  enabled: process.env.NEXT_PUBLIC_HELP_SYSTEM_ENABLED === 'true',
  searchEnabled: true,
  categoriesEnabled: true,
  contactFormEnabled: true,
  knowledgeBase: '/help',
}
```

## Responsive Configuration

### Breakpoints

```javascript
responsive: {
  mobile: {
    breakpoint: 768,
    behavior: 'overlay',
    animation: 'slideUp',
    fullScreen: true,
  },
  tablet: {
    breakpoint: 1024,
    behavior: 'sidebar',
    animation: 'slideIn',
    width: '400px',
  },
  desktop: {
    behavior: 'sidebar',
    animation: 'slideIn',
    width: '450px',
    persistent: true,
  }
}
```

### Animation Settings

```javascript
animations: {
  duration: 300,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  reducedMotion: true, // Respects user preferences
  
  // Panel-specific animations
  cart: { duration: 250 },
  filter: { duration: 200 },
  aiCompanion: { duration: 350 },
}
```

## Feature Flags

### Panel Features

```javascript
features: {
  // Navigation
  history: true,
  backButton: true,
  keyboardShortcuts: true,
  gestureSupport: true,
  
  // UI Enhancements
  searchInPanels: true,
  panelTabs: true,
  miniPanels: true,
  
  // Analytics
  trackPanelUsage: true,
  trackUserJourney: true,
  heatmapIntegration: false,
}
```

### Accessibility

```javascript
accessibility: {
  focusManagement: true,
  screenReaderSupport: true,
  highContrastMode: true,
  keyboardNavigation: true,
  announceChanges: true,
}
```

## Integration Settings

### Builder.io Integration

```javascript
builderIO: {
  enabled: true,
  publicKey: process.env.NEXT_PUBLIC_BUILDER_PUBLIC_KEY,
  panelContent: {
    cart: 'cart-panel-content',
    filter: 'filter-panel-content',
    help: 'help-panel-content',
  },
}
```

### Analytics Integration

```javascript
analytics: {
  enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
  providers: ['google', 'mixpanel'],
  trackEvents: [
    'panel_open',
    'panel_close',
    'panel_navigate',
    'action_complete',
  ],
}
```

## Development Configuration

### Debug Mode

```javascript
debug: {
  enabled: process.env.NODE_ENV === 'development',
  logLevel: 'info', // 'error' | 'warn' | 'info' | 'debug'
  showPanelBoundaries: true,
  performanceMetrics: true,
}
```

### Testing Configuration

```javascript
testing: {
  enableTestIds: process.env.NODE_ENV !== 'production',
  mockAI: process.env.NODE_ENV === 'test',
  disableAnimations: process.env.NODE_ENV === 'test',
}
```

## Complete Configuration Example

```javascript
// store.config.js
export const companionPanelConfig = {
  // Core Configuration
  enabledPanels: ['cart', 'filter', 'aiCompanion', 'helpCompanion'],
  defaultPanel: 'cart',
  autoClose: false,
  historyLimit: 10,
  
  // Panel-Specific Settings
  panels: {
    cart: {
      showMiniCart: true,
      persistCart: true,
      autoOpen: false,
    },
    filter: {
      showOnPages: ['/store', '/products'],
      defaultFilters: ['price', 'category'],
      rememberFilters: true,
    },
    aiCompanion: {
      enabled: process.env.NEXT_PUBLIC_AI_COMPANION_ENABLED === 'true',
      provider: 'openai',
      contextAware: true,
    },
  },
  
  // Responsive Behavior
  responsive: {
    mobileBreakpoint: 768,
    tabletBreakpoint: 1024,
    desktopWidth: '450px',
  },
  
  // Features
  features: {
    history: true,
    keyboardShortcuts: true,
    gestureSupport: true,
    analytics: true,
  },
  
  // Accessibility
  accessibility: {
    focusManagement: true,
    screenReaderSupport: true,
    keyboardNavigation: true,
  },
}
```

## Next Steps

- [Environment Setup](./environment-setup)
- [Feature Flags](./feature-flags)
- [Examples](./examples)
- [Troubleshooting](../troubleshooting/common-issues)