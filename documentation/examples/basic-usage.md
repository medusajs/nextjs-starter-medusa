# 🚀 Basic Usage Examples

## Overview

This guide provides practical examples of implementing and using the Companion Panel System in your Next.js application. Each example includes complete code snippets and explanations.

## 📋 Table of Contents

1. [Basic Setup](#basic-setup)
2. [Opening Panels](#opening-panels)
3. [Panel Navigation](#panel-navigation)
4. [Custom Panel Content](#custom-panel-content)
5. [Configuration Examples](#configuration-examples)
6. [Integration Patterns](#integration-patterns)

## 🔧 Basic Setup

### 1. Provider Setup

```typescript
// src/app/[countryCode]/(main)/layout.tsx
import { CompanionPanelProvider } from "@lib/context/companion-panel-context"
import { CartDrawerPanel } from "@modules/layout/components/cart-drawer"
import { ResponsivePageWrapper } from "@modules/layout/components/responsive-page-wrapper"

export default async function PageLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { countryCode: string }
}) {
  const cart = await getOrSetCart(params.countryCode)

  return (
    <CompanionPanelProvider>
      <Nav />
      <ResponsivePageWrapper>
        {children}
      </ResponsivePageWrapper>
      <Footer />
      
      {/* Panel Components */}
      <CartDrawerPanel cart={cart} />
    </CompanionPanelProvider>
  )
}
```

### 2. Basic Hook Usage

```typescript
// src/components/my-component.tsx
"use client"

import { useCompanionPanel } from "@lib/context/companion-panel-context"

const MyComponent = () => {
  const { 
    isOpen, 
    currentPanel, 
    openPanel, 
    closePanel 
  } = useCompanionPanel()

  return (
    <div>
      <p>Panel is {isOpen ? 'open' : 'closed'}</p>
      {currentPanel && (
        <p>Current panel: {currentPanel.type}</p>
      )}
      
      <button onClick={() => openPanel('cart')}>
        Open Cart
      </button>
      
      <button onClick={closePanel}>
        Close Panel
      </button>
    </div>
  )
}
```

## 🎯 Opening Panels

### 1. Simple Panel Opening

```typescript
// Basic panel opening
const ProductCard = ({ product }) => {
  const { openPanel } = useCompanionPanel()

  const handleAddToCart = async () => {
    try {
      await addToCart({
        variantId: product.defaultVariant.id,
        quantity: 1,
        countryCode: 'us'
      })
      
      // Open cart panel after successful addition
      openPanel('cart', {
        newItem: product,
        source: 'product-card'
      }, 'Shopping Cart')
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  return (
    <div className="product-card">
      <h3>{product.title}</h3>
      <p>${product.price}</p>
      <button 
        onClick={handleAddToCart}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add to Cart
      </button>
    </div>
  )
}
```

### 2. Panel with Custom Data

```typescript
// Opening panel with specific data and context
const FilterButton = ({ currentFilters }) => {
  const { openPanel } = useCompanionPanel()

  const handleOpenFilters = () => {
    openPanel('filter', {
      activeFilters: currentFilters,
      onFilterChange: (newFilters) => {
        console.log('Filters changed:', newFilters)
        // Handle filter updates
      },
      source: 'filter-button'
    }, 'Product Filters')
  }

  return (
    <button 
      onClick={handleOpenFilters}
      className="flex items-center gap-2 px-4 py-2 border rounded"
    >
      <span>🔍</span>
      Filters
      {Object.keys(currentFilters).length > 0 && (
        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          {Object.keys(currentFilters).length}
        </span>
      )}
    </button>
  )
}
```

### 3. Conditional Panel Opening

```typescript
// Opening panels based on feature flags
const AIAssistantButton = () => {
  const { openPanel } = useCompanionPanel()
  const { isFeatureEnabled } = useConfig()

  const handleOpenAI = () => {
    if (isFeatureEnabled('aiCompanion')) {
      openPanel('ai-assistant', {
        context: 'product-discovery',
        userQuery: '',
        sessionId: generateSessionId()
      }, 'AI Shopping Assistant')
    } else {
      // Fallback behavior
      alert('AI Assistant is not available')
    }
  }

  // Don't render if feature is disabled
  if (!isFeatureEnabled('aiCompanion')) {
    return null
  }

  return (
    <button 
      onClick={handleOpenAI}
      className="bg-purple-500 text-white px-4 py-2 rounded flex items-center gap-2"
    >
      <span>🤖</span>
      AI Assistant
    </button>
  )
}
```

## 🧭 Panel Navigation

### 1. History Navigation

```typescript
// Component with back navigation
const PanelHeader = () => {
  const { currentPanel, canGoBack, goBack, closePanel } = useCompanionPanel()

  if (!currentPanel) return null

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        {canGoBack && (
          <button 
            onClick={goBack}
            className="p-1 hover:bg-gray-100 rounded"
            title="Go back"
          >
            ←
          </button>
        )}
        <h2 className="text-lg font-semibold">
          {currentPanel.title}
        </h2>
      </div>
      
      <button 
        onClick={closePanel}
        className="p-1 hover:bg-gray-100 rounded"
        title="Close"
      >
        ×
      </button>
    </div>
  )
}
```

### 2. Panel Transitions

```typescript
// Smooth transitions between panels
const ProductActions = ({ product }) => {
  const { openPanel } = useCompanionPanel()

  const handleCompareProducts = () => {
    // First open the product comparison panel
    openPanel('product-compare', {
      products: [product.id],
      source: 'product-page'
    }, 'Compare Products')
  }

  const handleViewReviews = () => {
    // Navigate from current panel to reviews
    openPanel('reviews', {
      productId: product.id,
      source: 'product-actions'
    }, `Reviews for ${product.title}`)
  }

  return (
    <div className="flex gap-2">
      <button 
        onClick={handleCompareProducts}
        className="px-4 py-2 border rounded hover:bg-gray-50"
      >
        Compare
      </button>
      
      <button 
        onClick={handleViewReviews}
        className="px-4 py-2 border rounded hover:bg-gray-50"
      >
        Reviews
      </button>
    </div>
  )
}
```

### 3. Breadcrumb Navigation

```typescript
// Show navigation breadcrumbs in panel
const PanelBreadcrumbs = () => {
  const { panelHistory, currentPanel, openPanel } = useCompanionPanel()

  if (!currentPanel || panelHistory.length === 0) return null

  const navigateToPanel = (panelIndex: number) => {
    const targetPanel = panelHistory[panelIndex]
    openPanel(targetPanel.type, targetPanel.data, targetPanel.title)
  }

  return (
    <div className="flex items-center gap-1 text-sm text-gray-500 p-2">
      {panelHistory.map((panel, index) => (
        <React.Fragment key={`${panel.type}-${panel.timestamp}`}>
          <button 
            onClick={() => navigateToPanel(index)}
            className="hover:text-gray-700 hover:underline"
          >
            {panel.title}
          </button>
          {index < panelHistory.length - 1 && <span>→</span>}
        </React.Fragment>
      ))}
      {panelHistory.length > 0 && <span>→</span>}
      <span className="text-gray-900 font-medium">
        {currentPanel.title}
      </span>
    </div>
  )
}
```

## 🎨 Custom Panel Content

### 1. Simple Custom Panel

```typescript
// Custom panel component
const WishlistPanel = ({ data }) => {
  const { closePanel } = useCompanionPanel()
  const [wishlistItems, setWishlistItems] = useState([])

  useEffect(() => {
    // Load wishlist items
    loadWishlistItems().then(setWishlistItems)
  }, [])

  const removeFromWishlist = async (itemId: string) => {
    try {
      await removeWishlistItem(itemId)
      setWishlistItems(prev => prev.filter(item => item.id !== itemId))
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">My Wishlist</h2>
        <p className="text-sm text-gray-500">
          {wishlistItems.length} items saved
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Your wishlist is empty</p>
            <button 
              onClick={closePanel}
              className="mt-2 text-blue-500 hover:underline"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlistItems.map(item => (
              <div key={item.id} className="flex gap-3 p-3 border rounded">
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-500">${item.price}</p>
                </div>
                <button 
                  onClick={() => removeFromWishlist(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

### 2. Panel with Form Handling

```typescript
// Panel with form and validation
const ContactSupportPanel = ({ data }) => {
  const { closePanel } = useCompanionPanel()
  const [formData, setFormData] = useState({
    subject: data?.subject || '',
    message: data?.message || '',
    priority: 'medium'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }
    
    if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      await submitSupportRequest(formData)
      
      // Show success message and close
      alert('Support request submitted successfully!')
      closePanel()
    } catch (error) {
      console.error('Failed to submit:', error)
      alert('Failed to submit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Contact Support</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Subject *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                subject: e.target.value
              }))}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of your issue"
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                priority: e.target.value
              }))}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                message: e.target.value
              }))}
              rows={6}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Please describe your issue in detail..."
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t flex gap-2">
          <button
            type="button"
            onClick={closePanel}
            className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  )
}
```

## ⚙️ Configuration Examples

### 1. Basic Configuration

```javascript
// store.config.js
const storeConfig = {
  featureFlags: {
    aiCompanion: true,
    helpCompanion: true,
    wishlist: false,
    productCompare: false,
    reviews: false,
  },
  
  layoutOptions: {
    maxVisibleButtons: 3,
    showLabels: true,
    showIcons: true,
    defaultPanelWidth: 400,
    maxPanelHistory: 10,
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

### 2. Advanced Configuration with Conditions

```javascript
// store.config.js - Environment-based configuration
const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

const storeConfig = {
  featureFlags: {
    aiCompanion: true,
    helpCompanion: true,
    // Enable experimental features only in development
    wishlist: isDevelopment,
    productCompare: isDevelopment,
    reviews: process.env.ENABLE_REVIEWS === 'true',
  },
  
  layoutOptions: {
    maxVisibleButtons: 3,
    showLabels: !isProduction, // Hide labels in production for cleaner UI
    showIcons: true,
    defaultPanelWidth: 400,
    maxPanelHistory: isProduction ? 5 : 10, // Limit history in production
  },
  
  globalSettings: {
    enableKeyboardShortcuts: true,
    enableGestures: true,
    enableAnalytics: isProduction,
  },
  
  development: {
    enableDebugMode: isDevelopment,
    showPanelDemoButtons: isDevelopment,
    logStateChanges: isDevelopment,
  },
}

module.exports = storeConfig
```

### 3. Using Configuration in Components

```typescript
// Using configuration in components
import { isFeatureEnabled, getLayoutConfig } from '@lib/config/companion-config'

const NavigationBar = () => {
  const layoutConfig = getLayoutConfig()
  const showLabels = layoutConfig.showLabels
  const maxButtons = layoutConfig.maxVisibleButtons

  const availableFeatures = [
    { key: 'aiCompanion', label: 'AI Assistant', icon: '🤖' },
    { key: 'helpCompanion', label: 'Help', icon: '❓' },
    { key: 'wishlist', label: 'Wishlist', icon: '❤️' },
    { key: 'productCompare', label: 'Compare', icon: '⚖️' },
    { key: 'reviews', label: 'Reviews', icon: '⭐' },
  ]

  const enabledFeatures = availableFeatures.filter(feature => 
    isFeatureEnabled(feature.key)
  ).slice(0, maxButtons)

  return (
    <nav className="flex gap-2">
      {enabledFeatures.map(feature => (
        <FeatureButton
          key={feature.key}
          feature={feature}
          showLabel={showLabels}
        />
      ))}
    </nav>
  )
}

const FeatureButton = ({ feature, showLabel }) => {
  const { openPanel } = useCompanionPanel()

  return (
    <button
      onClick={() => openPanel(feature.key)}
      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
    >
      <span>{feature.icon}</span>
      {showLabel && <span>{feature.label}</span>}
    </button>
  )
}
```

## 🔗 Integration Patterns

### 1. E-commerce Product Page Integration

```typescript
// Complete product page integration
const ProductPage = ({ product }) => {
  const { openPanel } = useCompanionPanel()
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])

  const handleAddToCart = async () => {
    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity: 1,
        countryCode: 'us'
      })
      
      // Open cart with context
      openPanel('cart', {
        newItem: {
          product,
          variant: selectedVariant,
          quantity: 1
        },
        source: 'product-page',
        autoClose: true // Auto-close after 3 seconds
      })
    } catch (error) {
      console.error('Add to cart failed:', error)
    }
  }

  const handleCompare = () => {
    openPanel('product-compare', {
      products: [product.id],
      source: 'product-page'
    }, 'Compare Products')
  }

  const handleAskAI = () => {
    openPanel('ai-assistant', {
      context: 'product-inquiry',
      productId: product.id,
      userQuery: `Tell me about ${product.title}`,
      suggestedQuestions: [
        'What are the key features?',
        'How does it compare to similar products?',
        'What do customers say about it?'
      ]
    }, 'AI Product Assistant')
  }

  return (
    <div className="product-page">
      <div className="product-images">
        {/* Product images */}
      </div>
      
      <div className="product-info">
        <h1>{product.title}</h1>
        <p className="price">${product.price}</p>
        
        {/* Variant selection */}
        <div className="variants">
          {product.variants.map(variant => (
            <button
              key={variant.id}
              onClick={() => setSelectedVariant(variant)}
              className={`variant-option ${
                selectedVariant.id === variant.id ? 'selected' : ''
              }`}
            >
              {variant.title}
            </button>
          ))}
        </div>
        
        {/* Action buttons */}
        <div className="product-actions">
          <button 
            onClick={handleAddToCart}
            className="add-to-cart-btn"
          >
            Add to Cart
          </button>
          
          {isFeatureEnabled('productCompare') && (
            <button 
              onClick={handleCompare}
              className="compare-btn"
            >
              Compare
            </button>
          )}
          
          {isFeatureEnabled('aiCompanion') && (
            <button 
              onClick={handleAskAI}
              className="ai-assistant-btn"
            >
              Ask AI
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
```

### 2. Search Results Integration

```typescript
// Search results with filtering
const SearchResults = ({ query, results }) => {
  const { openPanel } = useCompanionPanel()
  const [filters, setFilters] = useState({})

  const handleOpenFilters = () => {
    openPanel('filter', {
      activeFilters: filters,
      searchQuery: query,
      resultCount: results.length,
      onFilterChange: (newFilters) => {
        setFilters(newFilters)
        // Apply filters to results
      }
    }, 'Filter Results')
  }

  const handleAIHelp = () => {
    openPanel('ai-assistant', {
      context: 'search-assistance',
      searchQuery: query,
      resultCount: results.length,
      userQuery: `Help me find the best option from these ${results.length} results for "${query}"`
    }, 'Search Assistant')
  }

  return (
    <div className="search-results">
      <div className="search-header">
        <h2>Results for "{query}" ({results.length})</h2>
        
        <div className="search-actions">
          <button 
            onClick={handleOpenFilters}
            className="filter-btn"
          >
            🔍 Filters
            {Object.keys(filters).length > 0 && (
              <span className="filter-count">
                {Object.keys(filters).length}
              </span>
            )}
          </button>
          
          {isFeatureEnabled('aiCompanion') && (
            <button 
              onClick={handleAIHelp}
              className="ai-help-btn"
            >
              🤖 AI Help
            </button>
          )}
        </div>
      </div>
      
      <div className="results-grid">
        {results.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
```

### 3. Shopping Cart Integration

```typescript
// Enhanced cart trigger button
const CartTriggerButton = () => {
  const { openPanel, currentPanel, isOpen } = useCompanionPanel()
  const [cart, setCart] = useState(null)
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    // Load cart data
    loadCart().then(cartData => {
      setCart(cartData)
      setItemCount(cartData?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0)
    })
  }, [])

  const handleOpenCart = () => {
    openPanel('cart', {
      source: 'cart-button',
      items: cart?.items || []
    }, `Shopping Cart (${itemCount})`)
  }

  const isCartOpen = isOpen && currentPanel?.type === 'cart'

  return (
    <button
      onClick={handleOpenCart}
      className={`cart-trigger ${isCartOpen ? 'active' : ''}`}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <span className="cart-icon">🛒</span>
      {itemCount > 0 && (
        <span className="cart-count">{itemCount}</span>
      )}
      <span className="cart-label">Cart</span>
    </button>
  )
}
```

## 🎯 Best Practices

### 1. Error Handling

```typescript
// Robust error handling in panel operations
const SafePanel = ({ children }) => {
  const { closePanel } = useCompanionPanel()
  const [error, setError] = useState(null)

  const handleError = (error: Error) => {
    console.error('Panel error:', error)
    setError(error)
  }

  if (error) {
    return (
      <div className="panel-error">
        <h3>Something went wrong</h3>
        <p>{error.message}</p>
        <div className="error-actions">
          <button onClick={() => setError(null)}>
            Try Again
          </button>
          <button onClick={closePanel}>
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  )
}
```

### 2. Performance Optimization

```typescript
// Optimized panel component
const OptimizedPanel = memo(({ data, onClose }) => {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return processLargeDataSet(data)
  }, [data])

  // Memoize callbacks
  const handleAction = useCallback((actionData) => {
    performAction(actionData)
  }, [])

  return (
    <div className="panel">
      {/* Panel content */}
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison for re-render optimization
  return (
    prevProps.data.id === nextProps.data.id &&
    prevProps.data.timestamp === nextProps.data.timestamp
  )
})
```

### 3. Accessibility

```typescript
// Accessible panel implementation
const AccessiblePanel = ({ children, title }) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const { closePanel } = useCompanionPanel()

  // Focus management
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.focus()
    }
  }, [])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closePanel()
    }
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="panel-title"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="panel"
    >
      <h2 id="panel-title" className="sr-only">
        {title}
      </h2>
      {children}
    </div>
  )
}
```

## 📚 Next Steps

After implementing these basic patterns, explore:

1. [Advanced Workflows](./advanced-workflows.md) - Complex multi-panel interactions
2. [Custom Panel Development](./custom-panels.md) - Building your own panel types
3. [Performance Optimization](../companion-panel/performance.md) - Advanced performance techniques
4. [Testing Strategies](./testing-examples.md) - Comprehensive testing approaches