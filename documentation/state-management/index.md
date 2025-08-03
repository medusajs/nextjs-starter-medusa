# 🧠 State Management Overview

## Introduction

The Companion Panel System uses a sophisticated React Context-based state management architecture that handles panel lifecycle, history navigation, responsive breakpoints, and cross-component communication. This system is designed to scale from simple cart interactions to complex AI-driven workflows.

## 🏗️ State Architecture

### Core State Structure
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

### Panel State Interface
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

## 🔄 State Management Patterns

### Panel Lifecycle Management

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

### Responsive State Management
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

## 🎯 State Usage Patterns

### Basic Panel Control
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
  
  return (
    <button onClick={handleAddToCart}>Add to Cart</button>
  )
}
```

### Advanced Panel Navigation
```typescript
function AIWorkflowComponent() {
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
  
  return (
    <div>
      {canGoBack && (
        <button onClick={goBack}>
          ← Back to {panelHistory[panelHistory.length - 1]?.type}
        </button>
      )}
      {/* AI interface */}
    </div>
  )
}
```

## 📊 Performance Optimizations

### State Update Batching
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

### Memoization Strategies
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

### Selective Re-renders
```typescript
// Components only subscribe to what they need
function PanelHeader() {
  const { currentPanel } = useCompanionPanel()
  // Only re-renders when currentPanel changes
  
  return <h2>{currentPanel?.title}</h2>
}

function PanelControls() {
  const { openPanel, closePanel } = useCompanionPanel()  
  // Only re-renders when actions change (rarely)
  
  return (
    <div>
      <button onClick={() => openPanel('cart')}>Cart</button>
      <button onClick={closePanel}>Close</button>
    </div>
  )
}
```

## 🔗 Cross-Component Communication

### Panel-to-Panel Data Flow
```typescript
// Rich data context between panels
const workflowData = {
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
  }
}
```

### Event-Driven Updates
```typescript
// Panel events for analytics and side effects
type PanelEvent = 
  | { type: 'PANEL_OPENED', payload: { panelType: PanelType, data: any } }
  | { type: 'PANEL_CLOSED', payload: { panelType: PanelType } }
  | { type: 'PANEL_NAVIGATED_BACK', payload: { from: PanelType, to: PanelType } }

const dispatchPanelEvent = (event: PanelEvent) => {
  // Analytics tracking
  analytics.track(event.type, event.payload)
  
  // State updates or side effects
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

## 🧪 Testing State Management

### State Testing Utilities
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

## 📚 Documentation Sections

### [🎣 Hooks Guide](./hooks.md)
Complete guide to the `useCompanionPanel` hook and advanced usage patterns.

### [🔄 Panel Lifecycle](./lifecycle.md)
Deep dive into panel creation, updates, navigation, and cleanup.

### [⚡ Performance Optimization](./performance.md)
Strategies for optimizing state updates, re-renders, and memory usage.

### [🧪 Testing Approaches](./testing.md)
Comprehensive testing strategies for state management, including mocks and utilities.

## 🚀 Advanced State Patterns

### State Persistence
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
}
```

### State Synchronization
```typescript
// Sync state across browser tabs
const useCrossTabSync = () => {
  const { currentPanel, openPanel, closePanel } = useCompanionPanel()
  
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'panel-sync' && e.newValue) {
        const syncData = JSON.parse(e.newValue)
        
        if (syncData.action === 'open') {
          openPanel(syncData.type, syncData.data)
        } else if (syncData.action === 'close') {
          closePanel()
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [openPanel, closePanel])
}
```

### Context Splitting
```typescript
// Split context for better performance
const PanelStateContext = createContext<PanelState>()
const PanelActionsContext = createContext<PanelActions>()

// Consumers only re-render when their specific context changes
function PanelHeader() {
  const state = useContext(PanelStateContext)
  // Only re-renders on state changes
}

function PanelControls() {
  const actions = useContext(PanelActionsContext)
  // Only re-renders on action changes (rare)
}
```

## 🎯 State Management Best Practices

### 1. Minimize State Updates
```typescript
// Good: Update only when necessary
const handlePanelUpdate = useCallback((newData) => {
  if (JSON.stringify(currentPanel?.data) !== JSON.stringify(newData)) {
    openPanel(currentPanel.type, newData)
  }
}, [currentPanel, openPanel])

// Avoid: Unnecessary updates
const handleBadUpdate = () => {
  openPanel(currentPanel.type, currentPanel.data) // Same data!
}
```

### 2. Use Functional Updates
```typescript
// Good: Functional updates for reliability
setCurrentPanel(prev => ({
  ...prev,
  data: { ...prev.data, newField: value }
}))

// Avoid: Direct state references (can be stale)
setCurrentPanel({
  ...currentPanel, // Might be stale
  data: { ...currentPanel.data, newField: value }
})
```

### 3. Batch Related Updates
```typescript
// Good: Batch related state changes
const handleComplexWorkflow = () => {
  startTransition(() => {
    setCurrentPanel(newPanel)
    setPanelHistory(newHistory)
    setIsOpen(true)
  })
}
```

---

## 🌟 **State-Driven Architecture**

The state management system provides the foundation for complex AI-driven workflows while maintaining excellent performance and developer experience. It's designed to:

- **🎯 Scale**: From simple cart to complex AI workflows
- **⚡ Perform**: Optimized updates with minimal re-renders
- **🧪 Test**: Comprehensive testing utilities
- **🔧 Extend**: Easy to add new state patterns
- **📊 Monitor**: Built-in debugging and analytics hooks

Ready to build sophisticated shopping experiences with confidence! 🚀