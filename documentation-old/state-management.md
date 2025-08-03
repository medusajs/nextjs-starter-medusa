# 🧠 State Management

## Overview

The Companion Panel System uses a sophisticated React Context-based state management architecture that handles panel lifecycle, history navigation, responsive breakpoints, and cross-component communication. This document details the state structure, management patterns, and integration strategies.

## Core State Architecture

### 1. Context Provider Structure
**Location**: `src/lib/context/companion-panel-context.tsx`

```typescript
interface CompanionPanelContextType {
  // Core State
  isOpen: boolean                    // Global panel visibility
  currentPanel: PanelState | null    // Active panel data
  panelHistory: PanelState[]         // Navigation history stack
  isMobile: boolean                  // Responsive breakpoint state
  
  // Panel Actions
  openPanel: (type: PanelType, data?: any, title?: string) => void
  closePanel: () => void
  goBack: () => void
  clearHistory: () => void
  
  // Navigation Info  
  canGoBack: boolean                 // History availability
  historyCount: number               // Stack depth
  
  // Legacy Cart API (backward compatibility)
  openCartPanel: () => void
  closeCartPanel: () => void
  toggleCartPanel: () => void
}
```

### 2. Panel State Interface
```typescript
interface PanelState {
  type: PanelType                    // Panel identifier
  data?: any                         // Panel-specific payload
  timestamp: number                  // Creation time
  title: string                      // Display title
}

type PanelType = 'cart' | 'ai-assistant' | 'help' | 
                 'product-compare' | 'wishlist' | 'reviews'
```

### 3. Panel Configuration
```typescript
const PANEL_CONFIG: Record<PanelType, {
  defaultTitle: string
  icon?: string
}> = {
  'cart': { defaultTitle: 'Shopping Cart', icon: '🛒' },
  'ai-assistant': { defaultTitle: 'AI Shopping Assistant', icon: '🤖' },
  'help': { defaultTitle: 'Help & Support', icon: '❓' },
  'product-compare': { defaultTitle: 'Compare Products', icon: '⚖️' },
  'wishlist': { defaultTitle: 'Wishlist', icon: '❤️' },
  'reviews': { defaultTitle: 'Reviews', icon: '⭐' },
}
```

## State Management Patterns

### 1. Panel Lifecycle Management

#### Opening Panels
```typescript
const openPanel = useCallback((type: PanelType, data?: any, customTitle?: string) => {
  const title = customTitle || PANEL_CONFIG[type]?.defaultTitle || type
  
  const newPanel: PanelState = {
    type,
    data,
    timestamp: Date.now(),
    title,
  }

  // Smart history management
  if (currentPanel?.type === type) {
    // Same type: update data, don't add to history
    setCurrentPanel(newPanel)
    return
  }

  // Different type: save current to history
  setPanelHistory(prev => {
    if (currentPanel) {
      const newHistory = [...prev, currentPanel]
      return newHistory.slice(-10) // Keep last 10 items
    }
    return prev
  })

  setCurrentPanel(newPanel)
  setIsOpen(true)
}, [currentPanel])
```

#### Closing Panels
```typescript
const closePanel = useCallback(() => {
  setIsOpen(false)
  setCurrentPanel(null)
  setPanelHistory([]) // Clear entire history
}, [])
```

#### History Navigation
```typescript
const goBack = useCallback(() => {
  if (panelHistory.length === 0) {
    closePanel()
    return
  }

  // Pop from history stack
  const previousPanel = panelHistory[panelHistory.length - 1]
  const newHistory = panelHistory.slice(0, -1)

  setCurrentPanel(previousPanel)
  setPanelHistory(newHistory)
}, [panelHistory, closePanel])
```

### 2. Responsive State Management

#### Breakpoint Detection
```typescript
const [isMobile, setIsMobile] = useState(false)

useEffect(() => {
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth < 768) // Tailwind md breakpoint
  }

  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
  return () => window.removeEventListener('resize', checkIsMobile)
}, [])
```

#### Device-Specific Behavior
```typescript
// State automatically adapts to device type
const deviceBehavior = {
  mobile: {
    panelStyle: 'overlay-modal',
    closeOnNavigation: true,
    gestureSupport: true,
  },
  desktop: {
    panelStyle: 'side-column', 
    persistOnNavigation: true,
    keyboardShortcuts: true,
  }
}
```

### 3. History Stack Management

#### Stack Operations
```typescript
// Push to history (max 10 items)
const pushToHistory = (panel: PanelState) => {
  setPanelHistory(prev => [...prev, panel].slice(-10))
}

// Pop from history
const popFromHistory = () => {
  setPanelHistory(prev => prev.slice(0, -1))
}

// Clear history
const clearHistory = () => {
  setPanelHistory([])
}
```

#### History State Queries
```typescript
const historyQueries = {
  canGoBack: panelHistory.length > 0,
  historyCount: panelHistory.length,
  previousPanel: panelHistory[panelHistory.length - 1] || null,
  historyTypes: panelHistory.map(p => p.type),
}
```

## Advanced State Patterns

### 1. Panel Data Flow

#### Data Passing
```typescript
// Rich data context between panels
const panelDataFlow = {
  // AI Assistant → Product Compare
  'ai-to-compare': {
    source: 'ai-assistant',
    products: ['prod1', 'prod2', 'prod3'],
    recommendation: 'Based on your gaming needs...',
    confidence: 0.95
  },
  
  // Product Compare → Cart
  'compare-to-cart': {
    source: 'product-compare',
    selectedProduct: 'prod2',
    comparisonData: { features: [], pros: [], cons: [] },
    userDecisionTime: 45000 // 45 seconds
  },
  
  // Cart → Checkout
  'cart-to-checkout': {
    source: 'cart',
    items: cartItems,
    subtotal: 299.99,
    workflow: 'ai-assisted-purchase'
  }
}
```

#### State Persistence
```typescript
// Panel data persists through navigation
const persistentState = {
  cartItems: [], // Always available
  aiContext: {}, // Maintains conversation context
  comparisonMatrix: {}, // Preserves product comparisons
  userPreferences: {}, // Learns from interactions
}
```

### 2. Event-Driven State Updates

#### Panel Events
```typescript
type PanelEvent = 
  | { type: 'PANEL_OPENED', payload: { panelType: PanelType, data: any } }
  | { type: 'PANEL_CLOSED', payload: { panelType: PanelType } }
  | { type: 'PANEL_NAVIGATED_BACK', payload: { from: PanelType, to: PanelType } }
  | { type: 'HISTORY_CLEARED', payload: {} }

// Event dispatching
const dispatchPanelEvent = (event: PanelEvent) => {
  // Analytics tracking
  analytics.track(event.type, event.payload)
  
  // State updates
  switch (event.type) {
    case 'PANEL_OPENED':
      // Handle panel opening side effects
      break
    case 'PANEL_CLOSED':
      // Handle cleanup
      break
  }
}
```

### 3. Cross-Panel Communication

#### Panel-to-Panel Messages
```typescript
interface PanelMessage {
  from: PanelType
  to: PanelType
  type: string
  payload: any
}

// Example: AI suggests products to compare
const aiToCompareMessage: PanelMessage = {
  from: 'ai-assistant',
  to: 'product-compare',
  type: 'SUGGEST_PRODUCTS',
  payload: {
    products: ['laptop-gaming-1', 'laptop-gaming-2'],
    reason: 'Based on your budget and gaming requirements',
    confidence: 0.92
  }
}
```

## Component Integration Patterns

### 1. Hook Usage Patterns

#### Basic Panel Control
```typescript
function ProductCard({ product }: { product: Product }) {
  const { openPanel } = useCompanionPanel()
  
  const handleAddToCart = () => {
    openPanel('cart', {
      newItem: product,
      source: 'product-card',
      timestamp: Date.now()
    })
  }
  
  const handleCompare = () => {
    openPanel('product-compare', {
      products: [product.id],
      source: 'product-card'
    })
  }
  
  return (
    <div>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <button onClick={handleCompare}>Compare</button>
    </div>
  )
}
```

#### Advanced Panel Navigation
```typescript
function AIAssistant() {
  const { 
    openPanel, 
    goBack, 
    canGoBack, 
    currentPanel,
    panelHistory 
  } = useCompanionPanel()
  
  const handleProductRecommendation = (products: Product[]) => {
    // AI suggests opening product comparison
    openPanel('product-compare', {
      products: products.map(p => p.id),
      source: 'ai-recommendation',
      aiContext: currentPanel?.data
    }, `Compare ${products.length} Products`)
  }
  
  const handleBackToAssistant = () => {
    if (canGoBack) {
      goBack() // Navigate back to AI assistant
    }
  }
  
  return (
    <div>
      {/* AI assistant UI */}
      <ChatInterface onRecommendProducts={handleProductRecommendation} />
    </div>
  )
}
```

### 2. Server Component Integration

#### Cart Data Fetching
```typescript
// src/modules/layout/components/cart-button/index.tsx
export default async function CartButton() {
  const cart = await retrieveCart().catch(() => null)

  return (
    <>
      <CartTriggerButton cart={cart} />
      <CompanionPanel cart={cart} />
    </>
  )
}
```

#### State Hydration
```typescript
// Hydrate panel state with server data
function CartPanel({ cart }: { cart: Cart | null }) {
  const { currentPanel, openPanel } = useCompanionPanel()
  
  useEffect(() => {
    // Auto-open cart if items were added server-side
    if (cart?.items?.length && !currentPanel) {
      openPanel('cart', { 
        items: cart.items,
        source: 'server-hydration'
      })
    }
  }, [cart, currentPanel, openPanel])
}
```

## Performance Optimizations

### 1. State Update Batching
```typescript
// Batch multiple state updates
const performComplexOperation = useCallback(() => {
  unstable_batchedUpdates(() => {
    setCurrentPanel(newPanel)
    setPanelHistory(newHistory)
    setIsOpen(true)
  })
}, [])
```

### 2. Memoization Strategies
```typescript
// Memoize complex computations
const panelMetadata = useMemo(() => {
  return {
    totalPanels: Object.keys(PANEL_CONFIG).length,
    historyDepth: panelHistory.length,
    currentPanelAge: currentPanel 
      ? Date.now() - currentPanel.timestamp 
      : 0
  }
}, [panelHistory.length, currentPanel])

// Memoize event handlers
const handlePanelOpen = useCallback((type: PanelType) => {
  openPanel(type, { source: 'navigation' })
}, [openPanel])
```

### 3. Selective Re-renders
```typescript
// Split context to minimize re-renders
const PanelStateContext = createContext<PanelState>()
const PanelActionsContext = createContext<PanelActions>()

// Components only subscribe to what they need
function PanelHeader() {
  const { currentPanel } = useContext(PanelStateContext)
  // Only re-renders when currentPanel changes
}

function PanelControls() {
  const { openPanel, closePanel } = useContext(PanelActionsContext)  
  // Only re-renders when actions change (rarely)
}
```

## Debug and Development Tools

### 1. Development Logging
```typescript
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 Panel State Update:', {
      isOpen,
      currentPanel: currentPanel?.type,
      historyCount: panelHistory.length,
      history: panelHistory.map(p => p.type),
      isMobile,
      timestamp: new Date().toISOString()
    })
  }
}, [isOpen, currentPanel, panelHistory, isMobile])
```

### 2. State Inspector Component
```typescript
function PanelStateInspector() {
  const state = useCompanionPanel()
  
  if (process.env.NODE_ENV !== 'development') return null
  
  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded text-xs">
      <h4>Panel State</h4>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  )
}
```

### 3. Redux DevTools Integration
```typescript
// Optional Redux DevTools support for debugging
const panelStateReducer = (state: PanelState, action: PanelAction) => {
  // Implement reducer logic
}

// Connect to Redux DevTools
const devTools = window.__REDUX_DEVTOOLS_EXTENSION__?.connect({
  name: 'Companion Panel System'
})

devTools?.send(action, state)
```

## Testing Strategies

### 1. State Testing
```typescript
describe('Companion Panel State', () => {
  test('opens panel with correct state', () => {
    const { result } = renderHook(() => useCompanionPanel(), {
      wrapper: CompanionPanelProvider
    })
    
    act(() => {
      result.current.openPanel('cart', { items: ['test'] })
    })
    
    expect(result.current.isOpen).toBe(true)
    expect(result.current.currentPanel?.type).toBe('cart')
    expect(result.current.currentPanel?.data).toEqual({ items: ['test'] })
  })
  
  test('manages history correctly', () => {
    const { result } = renderHook(() => useCompanionPanel(), {
      wrapper: CompanionPanelProvider  
    })
    
    // Open multiple panels
    act(() => {
      result.current.openPanel('ai-assistant')
    })
    
    act(() => {
      result.current.openPanel('product-compare')
    })
    
    // Check history
    expect(result.current.historyCount).toBe(1)
    expect(result.current.canGoBack).toBe(true)
    
    // Navigate back
    act(() => {
      result.current.goBack()
    })
    
    expect(result.current.currentPanel?.type).toBe('ai-assistant')
  })
})
```

### 2. Integration Testing
```typescript
describe('Panel Integration', () => {
  test('cart trigger opens cart with data', async () => {
    const mockCart = { items: [{ id: '1', name: 'Test Product' }] }
    
    render(
      <CompanionPanelProvider>
        <CartTriggerButton cart={mockCart} />
        <CompanionPanel cart={mockCart} />
      </CompanionPanelProvider>
    )
    
    fireEvent.click(screen.getByTestId('cart-trigger-button'))
    
    await waitFor(() => {
      expect(screen.getByText('Shopping Cart (1)')).toBeInTheDocument()
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })
  })
})
```

## Migration and Backward Compatibility

### 1. Legacy API Support
```typescript
// Maintain backward compatibility with old cart dropdown API
export const useCartPanel = () => {
  const context = useCompanionPanel()
  
  return {
    ...context,
    // Legacy methods
    openCartPanel: () => context.openPanel('cart'),
    closeCartPanel: context.closePanel,
    toggleCartPanel: () => {
      if (context.isOpen && context.currentPanel?.type === 'cart') {
        context.closePanel()
      } else {
        context.openPanel('cart')
      }
    }
  }
}
```

### 2. Gradual Migration
```typescript
// Support both old and new patterns during migration
const CartComponent = () => {
  const { openPanel } = useCompanionPanel()
  
  // New pattern (preferred)
  const handleNewOpen = () => {
    openPanel('cart', { source: 'header' })
  }
  
  // Legacy pattern (deprecated but supported)
  const handleLegacyOpen = () => {
    openCartPanel() // Maps to openPanel('cart')
  }
}
```

---

## 🧠 State Management Benefits

- **🎯 Centralized Control**: Single source of truth for all panel state
- **🔄 History Management**: Natural navigation patterns with back/forward support
- **📱 Responsive Awareness**: Automatic adaptation to device capabilities
- **⚡ Performance Optimized**: Efficient updates with minimal re-renders
- **🔧 Developer Friendly**: Rich debugging tools and TypeScript support
- **🧪 Test Ready**: Comprehensive testing utilities and mocking support

The state management system provides the robust foundation needed for complex AI-driven e-commerce workflows! 🚀