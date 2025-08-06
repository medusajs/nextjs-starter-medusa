---
title: Builder.io Integration
description: Complete guide to integrating Builder.io with the companion panel system
sidebar_position: 1
---

# 🏗️ Builder.io Integration

Builder.io integration enables dynamic content management for your companion panels, allowing non-technical users to customize panel content without code changes.

## Quick Start

### 1. Install Dependencies

```bash
npm install @builder.io/react @builder.io/sdk
```

### 2. Environment Setup

```bash
# .env.local
NEXT_PUBLIC_BUILDER_PUBLIC_KEY=your_builder_public_key_here
BUILDER_PRIVATE_KEY=your_builder_private_key_here
```

### 3. Configure Builder.io

```javascript
// store.config.js
export const builderConfig = {
  publicKey: process.env.NEXT_PUBLIC_BUILDER_PUBLIC_KEY,
  
  // Panel content models
  models: {
    'cart-panel-content': 'cart-panel-content',
    'filter-panel-content': 'filter-panel-content',
    'help-panel-content': 'help-panel-content',
    'ai-companion-content': 'ai-companion-content',
  },
  
  // Content targeting
  targeting: {
    urlPath: true,
    device: true,
    userSegment: true,
  },
}
```

## Integration Architecture

### Content Models

Builder.io content is organized into specific models for each panel type:

#### Cart Panel Content
- **Model Name**: `cart-panel-content`
- **Use Case**: Cart messaging, promotions, shipping info
- **Target Zones**: Header, footer, empty state, checkout flow

#### Filter Panel Content
- **Model Name**: `filter-panel-content`
- **Use Case**: Filter explanations, category promotions
- **Target Zones**: Header, category sections, help text

#### Help Panel Content
- **Model Name**: `help-panel-content`
- **Use Case**: FAQ content, support links, contact info
- **Target Zones**: Categories, search results, contact forms

### Dynamic Content Loading

```typescript
// hooks/useBuilderContent.ts
import { builder } from '@builder.io/react'

export function useBuilderContent(model: string, options = {}) {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    builder
      .get(model, {
        userAttributes: {
          urlPath: window.location.pathname,
          device: getDeviceType(),
          ...options,
        },
      })
      .promise()
      .then(setContent)
      .finally(() => setLoading(false))
  }, [model, options])
  
  return { content, loading }
}
```

### Panel Integration

```typescript
// components/panels/CartPanel.tsx
import { BuilderComponent } from '@builder.io/react'
import { useBuilderContent } from '@/hooks/useBuilderContent'

export function CartPanel() {
  const { content: headerContent } = useBuilderContent('cart-panel-content', {
    target: 'header',
  })
  
  return (
    <div className="cart-panel">
      {/* Dynamic Header Content */}
      {headerContent && (
        <BuilderComponent
          model="cart-panel-content"
          content={headerContent}
        />
      )}
      
      {/* Cart Items */}
      <CartItems />
      
      {/* Dynamic Footer Content */}
      <BuilderComponent
        model="cart-panel-content"
        options={{ target: 'footer' }}
      />
    </div>
  )
}
```

## Content Targeting

### URL-Based Targeting

Target content based on the current page:

```javascript
// Builder.io Targeting Rules
{
  "urlPath": "/products/*",
  "panelType": "filter"
}
```

### User Segment Targeting

Personalize content based on user behavior:

```javascript
// Custom targeting attributes
{
  "userSegment": "returning-customer",
  "cartValue": "> 100",
  "previousPurchases": "> 0"
}
```

### Device Targeting

Responsive content for different devices:

```javascript
{
  "device": "mobile",
  "screenSize": "< 768px"
}
```

## Content Types

### Promotional Banners

```typescript
// Example: Cart panel promotion
{
  "@type": "@builder.io/core:Element",
  "component": {
    "name": "PromoBanner",
    "options": {
      "message": "Free shipping on orders over $50!",
      "ctaText": "Shop Now",
      "ctaLink": "/products",
      "backgroundColor": "#e3f2fd"
    }
  }
}
```

### Help Content

```typescript
// Example: Help panel FAQ
{
  "@type": "@builder.io/core:Element",
  "component": {
    "name": "FAQSection",
    "options": {
      "title": "Frequently Asked Questions",
      "questions": [
        {
          "question": "How do I track my order?",
          "answer": "You can track your order using the tracking link in your confirmation email."
        }
      ]
    }
  }
}
```

### Dynamic Filters

```typescript
// Example: Filter panel category promotion
{
  "@type": "@builder.io/core:Element",
  "component": {
    "name": "CategoryPromo",
    "options": {
      "category": "electronics",
      "discount": "20%",
      "validUntil": "2024-12-31"
    }
  }
}
```

## Custom Components

### Register Custom Components

```typescript
// components/builder/CustomComponents.tsx
import { Builder } from '@builder.io/react'

// Cart-specific components
Builder.registerComponent(CartPromotion, {
  name: 'CartPromotion',
  inputs: [
    { name: 'title', type: 'string' },
    { name: 'message', type: 'richText' },
    { name: 'threshold', type: 'number' },
    { name: 'discount', type: 'string' },
  ],
})

// Filter-specific components
Builder.registerComponent(FilterHelper, {
  name: 'FilterHelper',
  inputs: [
    { name: 'category', type: 'string' },
    { name: 'helpText', type: 'richText' },
    { name: 'showExamples', type: 'boolean' },
  ],
})

// Help system components
Builder.registerComponent(ContactForm, {
  name: 'ContactForm',
  inputs: [
    { name: 'title', type: 'string' },
    { name: 'departments', type: 'list', subFields: [
      { name: 'name', type: 'string' },
      { name: 'email', type: 'string' },
    ]},
  ],
})
```

### Component Implementation

```typescript
// components/CartPromotion.tsx
interface CartPromotionProps {
  title: string
  message: string
  threshold: number
  discount: string
}

export function CartPromotion({ title, message, threshold, discount }: CartPromotionProps) {
  const { cart } = useCart()
  const showPromo = cart.total < threshold
  
  if (!showPromo) return null
  
  return (
    <div className="cart-promotion">
      <h3>{title}</h3>
      <div dangerouslySetInnerHTML={{ __html: message }} />
      <div className="discount-badge">{discount} OFF</div>
      <div className="threshold-info">
        Spend ${(threshold - cart.total).toFixed(2)} more to qualify!
      </div>
    </div>
  )
}
```

## Content Management Workflow

### 1. Content Creation
- Create content models in Builder.io
- Define targeting rules
- Add custom components
- Preview content

### 2. Content Deployment
- Publish content changes
- A/B test different versions
- Monitor performance metrics

### 3. Content Optimization
- Analyze engagement metrics
- Update content based on user behavior
- Optimize for conversions

## Performance Optimization

### Content Caching

```typescript
// utils/builderCache.ts
const contentCache = new Map()

export async function getCachedContent(model: string, options = {}) {
  const cacheKey = `${model}-${JSON.stringify(options)}`
  
  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey)
  }
  
  const content = await builder.get(model, options).promise()
  contentCache.set(cacheKey, content)
  
  return content
}
```

### Lazy Loading

```typescript
// Lazy load Builder content
const BuilderComponent = lazy(() => import('@builder.io/react').then(module => ({
  default: module.BuilderComponent
})))
```

## Troubleshooting

### Common Issues

1. **Content Not Loading**
   - Verify API keys are correct
   - Check targeting rules
   - Ensure model names match

2. **Custom Components Not Rendering**
   - Verify component registration
   - Check component props
   - Review Builder.io component settings

3. **Performance Issues**
   - Implement content caching
   - Use lazy loading
   - Optimize targeting rules

## Next Steps

- [Stripe Integration](./stripe)
- [Medusa Integration](./medusa)
- [Configuration Guide](../configuration/overview)
- [Development Setup](../development/setup)