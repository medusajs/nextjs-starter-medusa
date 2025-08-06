<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>

<h1 align="center">
  Medusa Next.js Starter Template
</h1>
<p align="center">
  <strong>Enhanced with AI-Powered Companion Panel System</strong>
</p>

<p align="center">
Combine Medusa's modules for your commerce backend with the newest Next.js 15 features for a performant storefront. Includes an advanced companion panel system with AI shopping assistant, contextual help, and configurable features.</p>

<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

### Prerequisites

To use the [Next.js Starter Template](https://medusajs.com/nextjs-commerce/), you should have a Medusa server running locally on port 9000.
For a quick setup, run:

```shell
npx create-medusa-app@latest
```

Check out [create-medusa-app docs](https://docs.medusajs.com/learn/installation) for more details and troubleshooting.

# Overview

The Medusa Next.js Starter is built with:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Medusa](https://medusajs.com/)

Features include:

- **Enhanced Companion Panel System**:
  - AI-powered shopping assistant with chat and ticket support
  - Contextual help and documentation system
  - Smart product filtering with dynamic panels
  - Persistent shopping cart with auto-open functionality
  - Panel history navigation and responsive design
  - Configurable feature flags for easy customization
- **Full ecommerce support**:
  - Product Detail Page
  - Product Overview Page
  - Product Collections
  - Cart
  - Checkout with Stripe
  - User Accounts
  - Order Details
- **Full Next.js 15 support**:
  - App Router
  - Next fetching/caching
  - Server Components
  - Server Actions
  - Streaming
  - Static Pre-Rendering

# Quickstart

### Setting up the environment variables

Navigate into your projects directory and get your environment variables ready:

```shell
cd nextjs-starter-medusa/
mv .env.template .env.local
```

The companion panel system configuration is managed via `store.config.js` (already included) - no additional environment variables needed.

### Install dependencies

Use Yarn to install all dependencies.

```shell
yarn
```

### Start developing

You are now ready to start up your project.

```shell
yarn dev
```

### Open the code and start customizing

Your site is now running at http://localhost:8000!

# 🤖 Companion Panel System

This starter includes an advanced **Companion Panel System** that transforms traditional modals into a persistent, AI-driven workflow companion. Instead of interrupting the user experience, panels slide out as secondary columns, creating a more immersive shopping experience.

## ⚡ Quick Configuration

Configure optional features by editing `store.config.js` in the project root:

```javascript
// store.config.js
const storeConfig = {
  featureFlags: {
    aiCompanion: true,      // AI Shopping Assistant
    helpCompanion: false    // Help & Support System (disabled by default)
    // Note: wishlist, productCompare, reviews not yet implemented
  },
  
  layoutOptions: {
    maxVisibleButtons: 3,   // Max buttons in navigation
    showLabels: false,      // Show text labels
    showIcons: true,        // Show icons
    defaultPanelWidth: 400, // Panel width (px)
    maxPanelHistory: 10,    // Maximum panel history items
  },
  
  globalSettings: {
    enableKeyboardShortcuts: true,
    enableGestures: true,
    enableAnalytics: true,
  },
  
  development: {
    enableDebugMode: false,
    showPanelDemoButtons: false,
    logStateChanges: false,
  },
}

module.exports = storeConfig
```

## 🎯 Available Features

| Feature | Status | Description |
|---------|---------|-------------|
| **AI Assistant** | ✅ Ready | AI-powered shopping help with chat and ticket system |
| **Help System** | ✅ Ready | Contextual documentation and support resources |
| **Shopping Cart** | ✅ Core | Smart cart with auto-open and history navigation |
| **Product Filters** | ✅ Core | Dynamic filtering on store and category pages |
| **Wishlist** | 🚧 Coming Soon | Save products for later |
| **Product Compare** | 🚧 Coming Soon | Side-by-side product comparison |
| **Reviews** | 🚧 Coming Soon | Product reviews and ratings |

## 🔧 Usage in Components

```typescript
import { isFeatureEnabled } from '@lib/config/companion-config'

// Conditional rendering
{isFeatureEnabled('aiCompanion') && (
  <AIAssistantButton />
)}

// Get all enabled features
const enabledFeatures = getEnabledFeatures()
// Returns: ['aiCompanion', 'helpCompanion']
```

## 📚 Documentation

- [Full Configuration Guide](./documentation/configuration/index.md)
- [Companion Panel System Overview](./documentation/COMPANION-PANEL-SYSTEM.md)
- [Quick Reference](./documentation/configuration/README.md)
- [Usage Examples](./documentation/configuration/examples.md)

# Payment integrations

By default this starter supports the following payment integrations

- [Stripe](https://stripe.com/)

To enable the integrations you need to add the following to your `.env.local` file:

```shell
NEXT_PUBLIC_STRIPE_KEY=<your-stripe-public-key>
```

You'll also need to setup the integrations in your Medusa server. See the [Medusa documentation](https://docs.medusajs.com) for more information on how to configure [Stripe](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider/stripe#main).

# Resources

## Learn more about Medusa

- [Website](https://www.medusajs.com/)
- [GitHub](https://github.com/medusajs)
- [Documentation](https://docs.medusajs.com/)

## Learn more about Next.js

- [Website](https://nextjs.org/)
- [GitHub](https://github.com/vercel/next.js)
- [Documentation](https://nextjs.org/docs)
