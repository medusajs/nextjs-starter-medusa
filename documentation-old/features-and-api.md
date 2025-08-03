# 🚀 Features and API Reference

## Overview

The Companion Panel System provides a comprehensive set of features for building modern, AI-driven e-commerce experiences. This document covers all available features, API methods, hooks, components, and integration patterns.

## Core Features

### 1. Multi-Panel Support
- **6 Panel Types**: Cart, AI Assistant, Help, Product Compare, Wishlist, Reviews
- **Extensible Architecture**: Easy to add custom panel types
- **Type Safety**: Full TypeScript support with intelligent autocomplete

### 2. History Navigation
- **Navigation Stack**: Back/forward through panel workflow
- **Gesture Support**: Ready for swipe navigation implementation
- **Keyboard Shortcuts**: ESC to close, Alt+← for back navigation
- **Workflow Memory**: Preserves user journey context

### 3. Responsive Design
- **Mobile**: Full-screen overlay modals with backdrop blur
- **Desktop**: Split-view companion columns with content compression
- **Adaptive**: Automatic device detection and layout switching
- **Touch Optimized**: Enhanced mobile interactions

### 4. Advanced Animations
- **Smooth Transitions**: Hardware-accelerated slide animations
- **Layout Compression**: Seamless main content adaptation
- **Performance Optimized**: 60fps animations with minimal re-renders

### 5. AI-Ready Architecture
- **Contextual Data**: Rich data passing between panels
- **Workflow Tracking**: Complete user journey analytics
- **Smart Suggestions**: Framework for AI-driven panel recommendations

## API Reference

### Hook: useCompanionPanel()

#### Core State
```typescript
const {
  // State
  isOpen: boolean,              // Panel visibility
  currentPanel: PanelState | null, // Active panel
  panelHistory: PanelState[],   // Navigation history
  isMobile: boolean,            // Device detection
  
  // Actions
  openPanel,                    // Open specific panel
  closePanel,                   // Close all panels
  goBack,                       // Navigate back
  clearHistory,                 // Clear navigation history
  
  // Navigation Info
  canGoBack: boolean,           // History availability
  historyCount: number,         // Stack depth
  
  // Legacy Cart API
  openCartPanel,
  closeCartPanel,
  toggleCartPanel,
} = useCompanionPanel()
```

#### Methods Reference

##### openPanel()
```typescript
openPanel(
  type: PanelType,           // Panel type to open
  data?: any,                // Optional panel data
  title?: string             // Optional custom title
): void

// Examples
openPanel('cart')
openPanel('ai-assistant', { query: 'Find me a laptop' })
openPanel('product-compare', { products: ['id1', 'id2'] }, 'Compare Laptops')
```

##### closePanel()
```typescript
closePanel(): void

// Closes current panel and clears history
```

##### goBack()
```typescript
goBack(): void

// Navigate to previous panel in history
// If no history, closes the panel system
```

##### clearHistory()
```typescript
clearHistory(): void

// Clears navigation history but keeps current panel open
```

### Types and Interfaces

#### PanelType
```typescript
type PanelType = 
  | 'cart'
  | 'ai-assistant'
  | 'help'
  | 'product-compare'
  | 'wishlist'
  | 'reviews'
```

#### PanelState
```typescript
interface PanelState {
  type: PanelType              // Panel identifier
  data?: any                   // Panel-specific data
  timestamp: number            // Creation timestamp
  title: string                // Display title
}
```

#### Panel Configuration
```typescript
interface PanelConfig {
  defaultTitle: string         // Default panel title
  icon?: string               // Optional emoji icon
}

const PANEL_CONFIG: Record<PanelType, PanelConfig>
```

## Component Reference

### CompanionPanelProvider
**Purpose**: Global state provider for the entire panel system
**Location**: Must wrap your app at a high level

```typescript
<CompanionPanelProvider>
  <YourApp />
</CompanionPanelProvider>
```

### CompanionPanel
**Purpose**: Universal panel renderer that displays the appropriate panel component
**Props**: 
- `cart?: HttpTypes.StoreCart | null` - Cart data for cart panel

```typescript
<CompanionPanel cart={cartData} />
```

### CartTriggerButton
**Purpose**: Smart cart trigger button with visual state feedback
**Props**:
- `cart?: HttpTypes.StoreCart | null` - Cart data for item count

```typescript
<CartTriggerButton cart={cartData} />
```

### ResponsivePageWrapper
**Purpose**: Wraps main content to handle layout compression
**Props**:
- `children: React.ReactNode` - Main page content

```typescript
<ResponsivePageWrapper>
  <YourPageContent />
</ResponsivePageWrapper>
```

## Feature Examples

### 1. Basic Panel Operations

#### Simple Panel Opening
```typescript
function ProductCard({ product }: { product: Product }) {
  const { openPanel } = useCompanionPanel()
  
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => openPanel('cart', { product })}>
        Add to Cart
      </button>
      <button onClick={() => openPanel('wishlist', { product })}>
        Save for Later
      </button>
    </div>
  )
}
```

#### Panel with Custom Data
```typescript
function AIHelperButton() {
  const { openPanel } = useCompanionPanel()
  
  const handleAIHelp = () => {
    openPanel('ai-assistant', {
      context: 'product-selection',
      userPreferences: {
        budget: '$500-$1000',
        category: 'laptops',
        usage: 'gaming'
      },
      currentPage: window.location.pathname
    }, 'AI Shopping Assistant')
  }
  
  return (
    <button onClick={handleAIHelp}>
      🤖 Get AI Help
    </button>
  )
}
```

### 2. Complex Workflow Patterns

#### AI-Guided Shopping Flow
```typescript
function AIGuidedWorkflow() {
  const { openPanel, currentPanel } = useCompanionPanel()
  
  const startShoppingJourney = () => {
    // 1. Start with AI assistant
    openPanel('ai-assistant', {
      mode: 'product-discovery',
      userQuery: 'I need a laptop for work and gaming'
    })
  }
  
  const compareRecommendations = (products: Product[]) => {
    // 2. AI suggests comparison
    openPanel('product-compare', {
      products: products.map(p => p.id),
      source: 'ai-recommendation',
      aiContext: currentPanel?.data,
      comparisonType: 'ai-guided'
    })
  }
  
  const addSelectedToCart = (selectedProduct: Product) => {
    // 3. Add chosen product to cart
    openPanel('cart', {
      newItem: selectedProduct,
      source: 'ai-workflow',
      workflowId: Date.now()
    })
  }
  
  return (
    <button onClick={startShoppingJourney}>
      Start AI Shopping Journey
    </button>
  )
}
```

#### History-Aware Navigation
```typescript
function NavigationAwareComponent() {
  const { 
    currentPanel,
    panelHistory, 
    canGoBack, 
    goBack,
    historyCount 
  } = useCompanionPanel()
  
  const handleSmartBack = () => {
    if (canGoBack) {
      const previousPanel = panelHistory[panelHistory.length - 1]
      console.log(`Going back from ${currentPanel?.type} to ${previousPanel.type}`)
      goBack()
    }
  }
  
  return (
    <div>
      <p>Current Panel: {currentPanel?.type}</p>
      <p>History Depth: {historyCount}</p>
      <button 
        onClick={handleSmartBack}
        disabled={!canGoBack}
      >
        ← Back to {panelHistory[panelHistory.length - 1]?.type}
      </button>
    </div>
  )
}
```

### 3. Responsive Behavior

#### Mobile-Specific Features
```typescript
function ResponsiveFeatures() {
  const { isMobile, isOpen, closePanel } = useCompanionPanel()
  
  useEffect(() => {
    if (isMobile && isOpen) {
      // Add mobile-specific behaviors
      document.body.style.overflow = 'hidden' // Prevent scroll
      
      // Handle hardware back button on Android
      const handleBackButton = (e: PopStateEvent) => {
        e.preventDefault()
        closePanel()
      }
      
      window.addEventListener('popstate', handleBackButton)
      return () => {
        document.body.style.overflow = 'auto'
        window.removeEventListener('popstate', handleBackButton)
      }
    }
  }, [isMobile, isOpen, closePanel])
}
```

#### Desktop-Specific Features
```typescript
function DesktopFeatures() {
  const { isMobile, isOpen, goBack, closePanel } = useCompanionPanel()
  
  useEffect(() => {
    if (!isMobile) {
      const handleKeyboardShortcuts = (e: KeyboardEvent) => {
        // Ctrl/Cmd + Shift + C = Open Cart
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
          openPanel('cart')
        }
        
        // Ctrl/Cmd + Shift + A = Open AI Assistant
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
          openPanel('ai-assistant')
        }
      }
      
      document.addEventListener('keydown', handleKeyboardShortcuts)
      return () => document.removeEventListener('keydown', handleKeyboardShortcuts)
    }
  }, [isMobile])
}
```

### 4. Data Integration Patterns

#### Cart Integration
```typescript
function CartIntegration() {
  const { openPanel, currentPanel } = useCompanionPanel()
  
  const addToCart = async (product: Product, variant: ProductVariant) => {
    // Add to cart via API
    const response = await fetch('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId: product.id, variantId: variant.id })
    })
    
    const updatedCart = await response.json()
    
    // Open cart with updated data
    openPanel('cart', {
      updatedCart,
      newItem: { product, variant },
      source: 'product-page',
      animation: 'highlight-new-item'
    }, `Cart (${updatedCart.items.length})`)
  }
}
```

#### Analytics Integration
```typescript
function AnalyticsIntegration() {
  const { currentPanel, panelHistory } = useCompanionPanel()
  
  useEffect(() => {
    if (currentPanel) {
      // Track panel opens
      analytics.track('Panel Opened', {
        panelType: currentPanel.type,
        panelData: currentPanel.data,
        timestamp: currentPanel.timestamp,
        historyDepth: panelHistory.length,
        source: currentPanel.data?.source || 'unknown'
      })
    }
  }, [currentPanel, panelHistory])
}
```

### 5. Custom Panel Implementation

#### Creating a New Panel Type
```typescript
// 1. Extend panel types
declare module '@lib/context/companion-panel-context' {
  interface PanelTypes {
    'custom-panel': {
      customData: string
      options: string[]
    }
  }
}

// 2. Create panel component
function CustomPanelComponent({ 
  data 
}: { 
  data?: { customData: string; options: string[] } 
}) {
  const { closePanel, goBack, canGoBack } = useCompanionPanel()
  
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {canGoBack && (
          <button onClick={goBack}>← Back</button>
        )}
        <h2>Custom Panel</h2>
        <button onClick={closePanel}>✕</button>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4">
        <p>{data?.customData}</p>
        {data?.options.map(option => (
          <div key={option}>{option}</div>
        ))}
      </div>
    </div>
  )
}

// 3. Register in CompanionPanel
const PanelComponents = {
  'custom-panel': CustomPanelComponent,
  // ... other panels
}
```

#### Using Custom Panel
```typescript
function UseCustomPanel() {
  const { openPanel } = useCompanionPanel()
  
  const handleOpenCustom = () => {
    openPanel('custom-panel', {
      customData: 'Hello from custom panel!',
      options: ['Option 1', 'Option 2', 'Option 3']
    }, 'My Custom Panel')
  }
  
  return (
    <button onClick={handleOpenCustom}>
      Open Custom Panel
    </button>
  )
}
```

## Advanced Features

### 1. Panel Persistence
```typescript
// Save panel state to localStorage
const usePanelPersistence = () => {
  const { currentPanel, panelHistory } = useCompanionPanel()
  
  useEffect(() => {
    const panelState = {
      currentPanel,
      panelHistory,
      timestamp: Date.now()
    }
    
    localStorage.setItem('companion-panel-state', JSON.stringify(panelState))
  }, [currentPanel, panelHistory])
  
  // Restore on app load
  useEffect(() => {
    const saved = localStorage.getItem('companion-panel-state')
    if (saved) {
      const { currentPanel, panelHistory } = JSON.parse(saved)
      // Restore state logic
    }
  }, [])
}
```

### 2. Panel Communication
```typescript
// Inter-panel message system
const usePanelMessaging = () => {
  const { currentPanel, openPanel } = useCompanionPanel()
  
  const sendMessage = (targetPanel: PanelType, message: any) => {
    openPanel(targetPanel, {
      ...message,
      messageFrom: currentPanel?.type,
      messageType: 'inter-panel-communication'
    })
  }
  
  return { sendMessage }
}

// Usage
function AIAssistantPanel() {
  const { sendMessage } = usePanelMessaging()
  
  const recommendProducts = (products: Product[]) => {
    sendMessage('product-compare', {
      products: products.map(p => p.id),
      aiRecommendation: true,
      reasoning: 'Based on your preferences...'
    })
  }
}
```

### 3. Gesture Support Integration
```typescript
// Swipe gesture hook (requires react-swipeable)
const usePanelGestures = () => {
  const { goBack, closePanel, canGoBack } = useCompanionPanel()
  
  const swipeHandlers = useSwipeable({
    onSwipedRight: () => {
      if (canGoBack) {
        goBack()
      } else {
        closePanel()
      }
    },
    onSwipedDown: () => {
      closePanel() // Mobile: swipe down to close
    },
    preventScrollOnSwipe: true,
    trackMouse: true, // Enable mouse gestures on desktop
  })
  
  return swipeHandlers
}

// Apply to panel content
function SwipeEnabledPanel() {
  const swipeHandlers = usePanelGestures()
  
  return (
    <div {...swipeHandlers} className="h-full">
      {/* Panel content */}
    </div>
  )
}
```

### 4. Performance Monitoring
```typescript
// Panel performance monitoring
const usePanelPerformance = () => {
  const { currentPanel, isOpen } = useCompanionPanel()
  
  useEffect(() => {
    if (isOpen && currentPanel) {
      const startTime = performance.now()
      
      // Measure panel render time
      requestAnimationFrame(() => {
        const renderTime = performance.now() - startTime
        
        if (renderTime > 16) { // > 60fps threshold
          console.warn(`Panel ${currentPanel.type} render took ${renderTime}ms`)
        }
        
        // Report to analytics
        analytics.track('Panel Performance', {
          panelType: currentPanel.type,
          renderTime,
          timestamp: Date.now()
        })
      })
    }
  }, [isOpen, currentPanel])
}
```

## Testing Utilities

### 1. Test Helpers
```typescript
// Testing utilities
export const createMockPanelProvider = (initialState?: Partial<CompanionPanelContextType>) => {
  return ({ children }: { children: React.ReactNode }) => (
    <CompanionPanelProvider>
      {children}
    </CompanionPanelProvider>
  )
}

export const mockPanelState = {
  isOpen: true,
  currentPanel: {
    type: 'cart' as PanelType,
    data: { items: [] },
    timestamp: Date.now(),
    title: 'Test Cart'
  },
  panelHistory: [],
  isMobile: false,
  canGoBack: false,
  historyCount: 0
}
```

### 2. Component Testing
```typescript
// Example component test
describe('Panel Integration', () => {
  test('opens cart panel with product data', async () => {
    const product = { id: '1', name: 'Test Product' }
    
    render(
      <CompanionPanelProvider>
        <ProductCard product={product} />
        <CompanionPanel />
      </CompanionPanelProvider>
    )
    
    fireEvent.click(screen.getByText('Add to Cart'))
    
    await waitFor(() => {
      expect(screen.getByText('Shopping Cart')).toBeInTheDocument()
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })
  })
  
  test('navigates back through panel history', async () => {
    render(
      <CompanionPanelProvider>
        <TestComponent />
      </CompanionPanelProvider>
    )
    
    // Open AI assistant
    fireEvent.click(screen.getByText('Open AI'))
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
    
    // Open product compare
    fireEvent.click(screen.getByText('Compare Products'))
    expect(screen.getByText('Compare Products')).toBeInTheDocument()
    
    // Navigate back
    fireEvent.click(screen.getByText('← Back'))
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
  })
})
```

## Migration Guide

### From Traditional Modals
```typescript
// Before: Traditional modal
const [showCartModal, setShowCartModal] = useState(false)

<Modal isOpen={showCartModal} onClose={() => setShowCartModal(false)}>
  <CartContent />
</Modal>

// After: Companion Panel
const { openPanel } = useCompanionPanel()

<button onClick={() => openPanel('cart')}>
  Open Cart
</button>
```

### From Legacy Cart Dropdown
```typescript
// Before: Legacy cart dropdown
import CartDropdown from './cart-dropdown'

// After: Companion panel system
import { CompanionPanelProvider } from '@lib/context/companion-panel-context'
import CompanionPanel from '@modules/layout/components/companion-panel'
import CartTriggerButton from '@modules/layout/components/cart-trigger-button'

<CompanionPanelProvider>
  <CartTriggerButton cart={cart} />
  <CompanionPanel cart={cart} />
</CompanionPanelProvider>
```

---

## 🎯 Feature Benefits

- **🚀 Performance**: Hardware-accelerated animations with minimal re-renders
- **🎨 User Experience**: Smooth, intuitive navigation that preserves context
- **🤖 AI Ready**: Perfect foundation for intelligent shopping assistants
- **📱 Mobile First**: Touch-optimized interactions with gesture support
- **🔧 Developer Friendly**: Type-safe API with comprehensive testing utilities
- **📊 Analytics Ready**: Built-in tracking for complex user workflows
- **♿ Accessible**: Full keyboard navigation and screen reader support

The feature set provides everything needed to build next-generation AI-driven e-commerce experiences! 🎉