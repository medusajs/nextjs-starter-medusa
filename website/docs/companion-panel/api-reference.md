# 📖 Complete API Reference

## Hook: useCompanionPanel()

The primary hook for interacting with the Companion Panel System.

### Core State Properties

```typescript
const {
  // State
  isOpen: boolean,                    // Panel visibility
  currentPanel: PanelState | null,    // Active panel
  panelHistory: PanelState[],         // Navigation history
  isMobile: boolean,                  // Device detection
  
  // Actions
  openPanel,                          // Open specific panel
  closePanel,                         // Close all panels
  goBack,                            // Navigate back
  clearHistory,                      // Clear navigation history
  
  // Navigation Info
  canGoBack: boolean,                // History availability
  historyCount: number,              // Stack depth
  
  // Legacy Cart API
  openCartPanel,
  closeCartPanel,
  toggleCartPanel,
} = useCompanionPanel()
```

### Method Reference

#### openPanel()
Opens a specific panel with optional data and title.

```typescript
openPanel(
  type: PanelType,           // Panel type to open
  data?: any,                // Optional panel data
  title?: string             // Optional custom title
): void
```

**Parameters:**
- `type` (required): The type of panel to open
- `data` (optional): Panel-specific data object
- `title` (optional): Custom title for the panel

**Examples:**
```typescript
// Simple panel opening
openPanel('cart')

// Panel with data
openPanel('cart', { 
  newItem: product,
  source: 'product-page' 
})

// Panel with custom title
openPanel('ai-assistant', 
  { context: 'product-help' }, 
  'AI Shopping Assistant'
)

// Complex data structure
openPanel('product-compare', {
  products: ['id1', 'id2', 'id3'],
  source: 'ai-recommendation',
  aiContext: {
    userPreferences: { budget: '$500-1000' },
    reasoning: 'Based on your gaming needs...'
  }
})
```

#### closePanel()
Closes the current panel and clears the entire history stack.

```typescript
closePanel(): void
```

**Behavior:**
- Closes any open panel
- Clears the entire navigation history
- Triggers cleanup animations
- Restores focus to the original trigger element

**Example:**
```typescript
const handleClose = () => {
  closePanel() // Closes panel and clears history
}
```

#### goBack()
Navigates to the previous panel in the history stack.

```typescript
goBack(): void
```

**Behavior:**
- If history exists: Navigate to previous panel
- If no history: Close the panel system entirely
- Maintains proper focus management
- Updates navigation state

**Example:**
```typescript
const handleBack = () => {
  if (canGoBack) {
    goBack() // Navigate to previous panel
  } else {
    console.log('No history available')
  }
}
```

#### clearHistory()
Clears the navigation history but keeps the current panel open.

```typescript
clearHistory(): void
```

**Use Cases:**
- Reset workflow after major action
- Prevent deep navigation stacks
- Clean up memory usage

**Example:**
```typescript
const handleCheckout = () => {
  // Clear history after successful checkout
  clearHistory()
  openPanel('cart', { message: 'Order placed successfully!' })
}
```

### Legacy Cart API
Maintained for backward compatibility.

```typescript
// Legacy methods (map to new API)
openCartPanel(): void       // → openPanel('cart')
closeCartPanel(): void      // → closePanel()
toggleCartPanel(): void     // Smart toggle for cart
```

## Types and Interfaces

### PanelType
Union type defining all available panel types.

```typescript
type PanelType = 
  | 'cart'
  | 'ai-assistant'
  | 'help'
  | 'product-compare'
  | 'wishlist'
  | 'reviews'
```

### PanelState
Interface defining the structure of panel state objects.

```typescript
interface PanelState {
  type: PanelType              // Panel identifier
  data?: any                   // Panel-specific data
  timestamp: number            // Creation timestamp (Date.now())
  title: string                // Display title
}
```

**Example PanelState objects:**
```typescript
// Cart panel state
const cartPanelState: PanelState = {
  type: 'cart',
  data: { 
    items: [...],
    source: 'product-page',
    newItem: product
  },
  timestamp: 1700000000000,
  title: 'Shopping Cart (3)'
}

// AI assistant panel state
const aiPanelState: PanelState = {
  type: 'ai-assistant',
  data: {
    query: 'Find me a gaming laptop',
    context: 'product-discovery',
    userPreferences: { budget: '$1000-1500' }
  },
  timestamp: 1700000000000,
  title: 'AI Shopping Assistant'
}
```

### CompanionPanelContextType
Complete interface for the context type.

```typescript
interface CompanionPanelContextType {
  // Core State
  isOpen: boolean
  currentPanel: PanelState | null
  panelHistory: PanelState[]
  isMobile: boolean
  
  // Panel Actions
  openPanel: (type: PanelType, data?: any, title?: string) => void
  closePanel: () => void
  goBack: () => void
  clearHistory: () => void
  
  // Navigation Info
  canGoBack: boolean
  historyCount: number
  
  // Legacy Cart API
  openCartPanel: () => void
  closeCartPanel: () => void
  toggleCartPanel: () => void
}
```

## Component Reference

### CompanionPanelProvider
Global state provider that must wrap your application.

**Props:** None
**Usage:**
```typescript
import { CompanionPanelProvider } from "@lib/context/companion-panel-context"

function App() {
  return (
    <CompanionPanelProvider>
      <YourApp />
    </CompanionPanelProvider>
  )
}
```

### CompanionPanel
Universal panel renderer that displays the appropriate panel component.

**Props:**
```typescript
interface CompanionPanelProps {
  cart?: HttpTypes.StoreCart | null  // Cart data for cart panel
}
```

**Usage:**
```typescript
import CompanionPanel from "@modules/layout/components/companion-panel"

function Layout({ cart }) {
  return (
    <div>
      {/* Your layout */}
      <CompanionPanel cart={cart} />
    </div>
  )
}
```

### CartTriggerButton
Smart cart trigger button with visual state feedback.

**Props:**
```typescript
interface CartTriggerButtonProps {
  cart?: HttpTypes.StoreCart | null  // Cart data for item count
}
```

**Features:**
- Shows current item count
- Visual feedback when cart panel is open
- Accessibility attributes
- Click handling with cart data

**Usage:**
```typescript
import CartTriggerButton from "@modules/layout/components/cart-trigger-button"

function Header({ cart }) {
  return (
    <header>
      <nav>
        <CartTriggerButton cart={cart} />
      </nav>
    </header>
  )
}
```

### ResponsivePageWrapper
Wraps main content to handle layout compression on desktop.

**Props:**
```typescript
interface ResponsivePageWrapperProps {
  children: React.ReactNode  // Main page content
}
```

**Behavior:**
- Mobile: No changes to content
- Desktop: Adds responsive margin when panels are open
- Smooth transitions with hardware acceleration

**Usage:**
```typescript
import ResponsivePageWrapper from "@modules/layout/components/responsive-page-wrapper"

function Layout({ children }) {
  return (
    <CompanionPanelProvider>
      <Header />
      <ResponsivePageWrapper>
        {children} {/* Automatically compresses on desktop */}
      </ResponsivePageWrapper>
      <Footer />
      <CompanionPanel />
    </CompanionPanelProvider>
  )
}
```

## Advanced API Patterns

### Panel Data Typing
Create type-safe panel data structures:

```typescript
// Define panel data types
interface PanelDataTypes {
  'cart': {
    items?: CartItem[]
    newItem?: Product
    source: string
  }
  'ai-assistant': {
    query?: string
    context: string
    userPreferences?: Record<string, any>
  }
  'product-compare': {
    products: string[]
    source: string
    aiContext?: any
  }
}

// Type-safe panel opening
const openTypedPanel = <T extends PanelType>(
  type: T,
  data: PanelDataTypes[T]
) => {
  openPanel(type, data)
}

// Usage with full type safety
openTypedPanel('cart', {
  newItem: product,
  source: 'product-page' // ✅ Type-safe
  // invalidProp: 'test'  // ❌ TypeScript error
})
```

### Event Handling Patterns
```typescript
// Panel event listeners
useEffect(() => {
  const handlePanelChange = () => {
    if (currentPanel?.type === 'cart') {
      // Cart-specific logic
      analytics.track('Cart Panel Opened')
    }
  }
  
  handlePanelChange()
}, [currentPanel])

// History navigation events
useEffect(() => {
  const handleHistoryChange = () => {
    analytics.track('Panel Navigation', {
      historyDepth: historyCount,
      canGoBack,
      currentPanel: currentPanel?.type
    })
  }
  
  handleHistoryChange()
}, [historyCount, canGoBack, currentPanel])
```

### Conditional Panel Logic
```typescript
// Smart panel opening based on conditions
const smartOpenPanel = (type: PanelType, data?: any) => {
  // Don't open same panel type with same data
  if (currentPanel?.type === type && 
      JSON.stringify(currentPanel.data) === JSON.stringify(data)) {
    return
  }
  
  // Mobile: close existing panel first
  if (isMobile && isOpen) {
    closePanel()
    setTimeout(() => openPanel(type, data), 300)
  } else {
    openPanel(type, data)
  }
}
```

### Performance Optimization Patterns
```typescript
// Memoized panel handlers
const handleCartOpen = useCallback(() => {
  openPanel('cart', { source: 'header' })
}, [openPanel])

const handleAIOpen = useCallback((context: string) => {
  openPanel('ai-assistant', { context })
}, [openPanel])

// Debounced panel operations
const debouncedOpenPanel = useMemo(
  () => debounce(openPanel, 150),
  [openPanel]
)
```

## Error Handling

### Common Error Patterns
```typescript
// Safe panel opening with error handling
const safeOpenPanel = (type: PanelType, data?: any) => {
  try {
    openPanel(type, data)
  } catch (error) {
    console.error('Failed to open panel:', error)
    // Fallback behavior
  }
}

// Validate panel data before opening
const validateAndOpenPanel = (type: PanelType, data?: any) => {
  if (type === 'cart' && data?.items && !Array.isArray(data.items)) {
    console.error('Cart panel requires items to be an array')
    return
  }
  
  openPanel(type, data)
}
```

### Debug Helpers
```typescript
// Development debugging
const debugPanelState = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Panel State Debug:', {
      isOpen,
      currentPanel: currentPanel?.type,
      historyCount,
      history: panelHistory.map(p => p.type),
      isMobile
    })
  }
}
```

---

## 🚀 Next Steps

- **Learn Workflows**: [AI Workflows Guide](./workflows.md)
- **Panel Types**: [Available Panel Types](./panel-types.md)
- **TypeScript**: [TypeScript Guide](./typescript.md)
- **Examples**: [Integration Examples](../integration/examples.md)