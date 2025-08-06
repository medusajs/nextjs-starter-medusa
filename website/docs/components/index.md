# 🧩 Components Overview

## Introduction

The Companion Panel System is built from modular, reusable components that work together to create a seamless user experience. Each component has a specific responsibility and can be customized or extended as needed.

## 🏗️ Component Architecture

```
CompanionPanelProvider (Context)
├── CartTriggerButton (Trigger)
├── FilterSortBar (Filter Controls)
├── CompanionPanel (Universal Renderer)
│   ├── CartDrawerPanel (Cart Implementation)
│   ├── FilterPanelContent (Filter Options)
│   ├── AIAssistantPanel (AI Chat Interface)
│   ├── HelpPanel (Support Interface)
│   └── CustomPanels (Extensible)
├── FilteredProductsContainer (Filter System)
│   ├── FilteredProductsClient (Client Logic)
│   └── PaginatedProducts (Results Display)
├── ResponsivePageWrapper (Layout Manager)
└── PanelDemoButtons (Development Tool)
```

## 🎯 Core Components

### [🎯 Filter System](./filter-system.md)
**Purpose**: Dynamic product filtering with auto-discovery
**Files**: `src/modules/store/components/filtered-products-container/`

**Key Features**:
- Auto-discovery of filter options from product data
- Hybrid filtering (API + client-side)
- Real-time filter state synchronization
- Responsive filter panel integration
- Smart type extraction from product handles
- Size detection from variant options

```typescript
// Usage
<FilteredProductsContainer
  sortBy={sortBy}
  page={page}
  countryCode={countryCode}
  searchParams={searchParams}
/>

// Features
- Dynamic filter discovery
- URL-based filter persistence
- Hybrid filtering strategy
- Performance optimized
- Type-safe implementation
```

### [🛒 Cart Drawer](./cart-drawer.md)
**Purpose**: Complete shopping cart implementation
**File**: `src/modules/layout/components/cart-drawer/index.tsx`

**Key Features**:
- Full cart CRUD operations
- Item management (add, remove, update quantities)
- Price calculations and tax display
- Responsive design (mobile overlay + desktop panel)
- History navigation integration

```typescript
// Usage
<CartDrawerPanel cart={cartData} />

// Features
- Add/remove items
- Quantity management
- Price calculations
- Checkout integration
- Empty state handling
```

### [🔘 Cart Trigger Button](./trigger-button.md)
**Purpose**: History-aware cart trigger with visual feedback
**File**: `src/modules/layout/components/cart-trigger-button/index.tsx`

**Key Features**:
- **History-aware navigation**: Respects panel history stack
- **Smart toggle behavior**: Goes back if history exists, closes if none
- Dynamic item count display
- Visual state feedback (shows when cart is open)
- Accessibility attributes
- Responsive behavior

```typescript
// Usage
<CartTriggerButton totalItems={cartItems} />

// History-aware behavior
const handleClick = () => {
  if (isCartOpen) {
    // Cart is currently open - respect history
    if (panelHistory.length > 0) {
      goBack() // Navigate to previous panel
    } else {
      closePanel() // No history, close entirely
    }
  } else {
    // Open cart panel
    openPanel('cart')
  }
}

// Props
interface CartTriggerButtonProps {
  totalItems: number
}
```

### [🎭 Panel Renderer](./panel-renderer.md)
**Purpose**: Universal panel component renderer
**File**: `src/modules/layout/components/companion-panel/index.tsx`

**Key Features**:
- Dynamic panel component loading
- Type-safe panel registration
- Props passing to child panels
- Error boundary handling

```typescript
// Panel registration
const PanelComponents = {
  'cart': CartDrawerPanel,
  'ai-assistant': AIAssistantPanel,
  'help': HelpPanel,
  'custom-panel': CustomPanelComponent,
}

// Automatic rendering based on current panel type
<CompanionPanel cart={cart} />
```

### [📐 Responsive Wrapper](./responsive-wrapper.md)
**Purpose**: Main content layout management
**File**: `src/modules/layout/components/responsive-page-wrapper/index.tsx`

**Key Features**:
- Automatic content compression on desktop
- Responsive breakpoint detection
- Smooth layout transitions
- Zero configuration required

```typescript
// Usage - wraps all main content
<ResponsivePageWrapper>
  <YourPageContent />
</ResponsivePageWrapper>

// Behavior
- Mobile: No changes to content
- Desktop: Compresses content when panels open
- Smooth transitions with hardware acceleration
```

### [🔌 Cart Button](./cart-button.md)
**Purpose**: Server component wrapper
**File**: `src/modules/layout/components/cart-button/index.tsx`

**Key Features**:
- Server-side cart data fetching
- Integration with Next.js app router
- Combines trigger and renderer
- Error handling for cart retrieval

```typescript
// Server component - handles data fetching
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

## 🛠️ Development Components

### [🎮 Panel Demo Buttons](./panel-demo-buttons.md)
**Purpose**: Development and testing tool
**File**: `src/modules/layout/components/panel-demo-buttons/index.tsx`

**Key Features**:
- Test all panel types
- Navigation controls (back, close)
- Real-time state display
- Development-only rendering

```typescript
// Development helper
function DevTools() {
  if (process.env.NODE_ENV !== 'development') return null
  
  return <PanelDemoButtons />
}

// Features
- Quick panel testing
- History navigation testing
- State inspection
- Workflow testing
```

## 🎯 Companion Trigger Buttons

### Universal History-Aware Pattern

All companion panel trigger buttons now follow a consistent, history-aware navigation pattern:

#### [🤖 AI Chat Trigger Button](./ai-chat-trigger.md)
**Purpose**: History-aware AI assistant trigger
**File**: `src/modules/layout/components/ai-chat-trigger-button/index.tsx`

```typescript
// Smart AI assistant toggle
const handleClick = () => {
  if (isAIOpen) {
    // AI is currently open - respect history
    if (panelHistory.length > 0) {
      goBack() // Navigate to previous panel (e.g. back to cart)
    } else {
      closePanel() // No history, close entirely
    }
  } else {
    // Open AI assistant panel
    openPanel('ai-assistant')
  }
}
```

#### [❓ Help Trigger Button](./help-trigger.md)
**Purpose**: History-aware help system trigger
**File**: `src/modules/layout/components/help-trigger-button/index.tsx`

```typescript
// Smart help toggle
const handleClick = () => {
  if (isHelpOpen) {
    // Help is currently open - respect history
    if (panelHistory.length > 0) {
      goBack() // Navigate to previous panel
    } else {
      closePanel() // No history, close entirely
    }
  } else {
    // Open help panel
    openPanel('help')
  }
}
```

#### [🔍 Filter Trigger Button](./filter-trigger.md)
**Purpose**: History-aware filter system trigger
**File**: `src/modules/store/components/filter-sort-bar/index.tsx`

```typescript
// Smart filter toggle (contextual - only appears on store/category pages)
const handleFilterClick = () => {
  if (currentPanel?.type === 'filter') {
    // Filter is currently open - respect history
    if (panelHistory.length > 0) {
      goBack() // Navigate to previous panel (e.g. back to AI assistant)
    } else {
      closePanel() // No history, close entirely
    }
  } else {
    // Open filter panel
    openPanel('filter', {
      filters: filterSections,
      activeFilters,
      onFilterChange: handleFilterChange
    }, 'Filters')
  }
}
```

### Enhanced Panel Headers

#### Dual Navigation Pattern
Filter panels feature enhanced headers with both back and close options:

```typescript
// Filter panel header with dual navigation
<div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
  {/* Left side - History-aware back button */}
  <button
    onClick={handleBackClick}
    className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md"
    title={panelHistory.length > 0 ? 'Go back' : 'Close filters'}
  >
    <ArrowLeft className="w-5 h-5" />
  </button>
  
  {/* Center - Title with active filter count */}
  <div className="flex items-center gap-2">
    <Filter className="w-5 h-5 text-gray-700" />
    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
    {activeFilterCount > 0 && (
      <span className="inline-flex items-center justify-center w-6 h-6 text-sm font-bold text-white bg-blue-600 rounded-full">
        {activeFilterCount}
      </span>
    )}
  </div>
  
  {/* Right side - Always-close button */}
  <button
    onClick={closePanel}
    className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md"
    title="Close filters"
  >
    <X className="w-5 h-5" />
  </button>
</div>
```

### Navigation Benefits

#### **Consistent User Experience**
- **✅ Predictable**: All trigger buttons behave the same way
- **✅ Intuitive**: Clicking active panel button goes "back" naturally
- **✅ Contextual**: Respects user's workflow history
- **✅ Non-disruptive**: Maintains workflow context

#### **Example Workflows**
```typescript
// Scenario: AI → Filter → Filter Button
// 1. Open AI assistant
openPanel('ai-assistant') // History: [], Current: ai-assistant

// 2. Open filters (AI goes to history)
openPanel('filter') // History: [ai-assistant], Current: filter

// 3. Click filter button → Goes back to AI ✅
handleFilterClick() // History: [], Current: ai-assistant
```

## 🛒 State-Aware Cart Auto-Open

### Enhanced Cart Behavior

The cart auto-open component now preserves user workflow context:

```typescript
// State-aware auto-open pattern
const CartAutoOpen = ({ autoOpenDuration = 4000 }) => {
  const [previousPanelState, setPreviousPanelState] = useState(null)
  
  const timedOpen = () => {
    // Capture current state before auto-opening
    const capturedState = {
      wasOpen: isOpen,
      panelType: currentPanel?.type || null,
      panelData: currentPanel?.data || null,
      panelTitle: currentPanel?.title || null
    }
    
    // Save state and open cart
    setPreviousPanelState(capturedState)
    openPanel('cart', cartData, `Cart (${totalItems})`)
    
    // Restore previous state after timeout
    setTimeout(() => {
      if (capturedState?.wasOpen && capturedState.panelType) {
        // Restore previous panel
        openPanel(capturedState.panelType, capturedState.panelData, capturedState.panelTitle)
      } else {
        // Nothing was open before, close entirely
        closePanel()
      }
      setPreviousPanelState(null)
    }, autoOpenDuration)
  }
}
```

#### Auto-Open Scenarios
- **AI Chat + Add Item**: Returns to AI chat after cart preview
- **Filter + Add Item**: Returns to filters after cart preview  
- **Empty State + Add Item**: Closes entirely after cart preview
- **Cart Open + Add Item**: Keeps cart open after update

## 🧬 Component Relationships

### Data Flow
```typescript
// 1. User clicks trigger
<CartTriggerButton onClick={triggerHandler} />

// 2. Trigger calls context method
const { openPanel } = useCompanionPanel()
openPanel('cart', { cartData })

// 3. Context updates state
setCurrentPanel({ type: 'cart', data: cartData })

// 4. Renderer displays appropriate component
<CompanionPanel /> // Renders CartDrawerPanel

// 5. Layout wrapper adjusts main content
<ResponsivePageWrapper /> // Compresses content on desktop
```

### State Sharing
```typescript
// All components share state through context
const {
  isOpen,           // Panel visibility
  currentPanel,     // Active panel data
  isMobile,         // Device detection
  openPanel,        // Open method
  closePanel,       // Close method
  goBack            // Navigation method
} = useCompanionPanel()
```

### Event Communication
```typescript
// Components communicate through context methods
interface ComponentCommunication {
  // Trigger → Context
  triggerToContext: () => openPanel('cart'),
  
  // Context → Renderer
  contextToRenderer: (panel: PanelState) => renderPanel(panel),
  
  // Renderer → Layout
  rendererToLayout: (isOpen: boolean) => adjustLayout(isOpen),
  
  // Panel → Context
  panelToContext: () => closePanel()
}
```

## 🎨 Component Customization

### Styling Customization
```typescript
// Each component accepts className props
<CartTriggerButton 
  cart={cart}
  className="custom-trigger-styles"
/>

// CSS customization
.custom-trigger-styles {
  /* Your custom styles */
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 50%;
}
```

### Behavior Customization
```typescript
// Custom trigger behavior
function CustomTriggerButton({ cart }) {
  const { openPanel } = useCompanionPanel()
  
  const handleCustomOpen = () => {
    // Custom logic before opening
    analytics.track('Custom Cart Open')
    
    openPanel('cart', {
      ...cart,
      source: 'custom-trigger',
      customData: { timestamp: Date.now() }
    })
  }
  
  return (
    <button onClick={handleCustomOpen}>
      🛒 {cart?.items?.length || 0}
    </button>
  )
}
```

### Component Extension
```typescript
// Extend existing components
function EnhancedCartDrawer({ cart, ...props }) {
  return (
    <div className="enhanced-cart-wrapper">
      <div className="custom-header">
        <h2>Enhanced Cart</h2>
      </div>
      
      <CartDrawerPanel cart={cart} {...props} />
      
      <div className="custom-footer">
        <button>Custom Action</button>
      </div>
    </div>
  )
}

// Register enhanced version
const PanelComponents = {
  'cart': EnhancedCartDrawer,
  // ... other panels
}
```

## 📊 Component Performance

### Bundle Sizes (Gzipped)
- **CartTriggerButton**: ~2KB
- **CartDrawerPanel**: ~12KB
- **CompanionPanel**: ~3KB
- **ResponsivePageWrapper**: ~1KB
- **Total Core System**: ~18KB

### Lazy Loading
```typescript
// Components support lazy loading
const LazyCartDrawer = lazy(() => 
  import('./cart-drawer').then(module => ({ 
    default: module.CartDrawerPanel 
  }))
)

// Use with Suspense
<Suspense fallback={<CartSkeleton />}>
  <LazyCartDrawer cart={cart} />
</Suspense>
```

### Performance Optimization
```typescript
// Memoized components for better performance
const MemoizedCartTrigger = memo(CartTriggerButton, (prevProps, nextProps) => {
  return prevProps.cart?.items?.length === nextProps.cart?.items?.length
})

// Optimized rendering
const OptimizedPanel = ({ currentPanel }) => {
  // Only render when panel type changes
  const PanelComponent = useMemo(() => {
    return PanelComponents[currentPanel?.type]
  }, [currentPanel?.type])
  
  return PanelComponent ? <PanelComponent data={currentPanel.data} /> : null
}
```

## 🧪 Component Testing

### Testing Utilities
```typescript
// Test helpers for each component
import { render, fireEvent, screen } from '@testing-library/react'
import { CompanionPanelProvider } from '@lib/context/companion-panel-context'

const renderWithProvider = (component) => {
  return render(
    <CompanionPanelProvider>
      {component}
    </CompanionPanelProvider>
  )
}

// Component-specific tests
describe('CartTriggerButton', () => {
  test('displays correct item count', () => {
    const mockCart = { items: [{ id: '1' }, { id: '2' }] }
    
    renderWithProvider(<CartTriggerButton cart={mockCart} />)
    
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})
```

### Integration Testing
```typescript
// Test component interactions
test('trigger opens panel', async () => {
  renderWithProvider(
    <>
      <CartTriggerButton cart={mockCart} />
      <CompanionPanel cart={mockCart} />
    </>
  )
  
  // Click trigger
  fireEvent.click(screen.getByTestId('cart-trigger-button'))
  
  // Panel should appear
  await waitFor(() => {
    expect(screen.getByTestId('cart-drawer-content')).toBeInTheDocument()
  })
})
```

## 📚 Component Documentation

### Individual Component Guides

#### [🛒 Cart Drawer Component](./cart-drawer.md)
- Complete cart functionality
- Item management and pricing
- Responsive behavior
- Customization options

#### [🔘 Trigger Button Component](./trigger-button.md)
- Smart triggering logic
- Visual feedback states
- Accessibility features
- Custom styling

#### [🎭 Panel Renderer Component](./panel-renderer.md)
- Dynamic component loading
- Panel registration system
- Error handling
- Performance optimization

#### [📐 Responsive Wrapper Component](./responsive-wrapper.md)
- Layout management
- Responsive behavior
- Animation system
- Browser compatibility

## 🔧 Component Development

### Creating Custom Components
```typescript
// 1. Create component following pattern
function CustomPanelComponent({ data }) {
  const { closePanel, goBack, canGoBack } = useCompanionPanel()
  
  return (
    <div className="flex h-full flex-col">
      {/* Header with navigation */}
      <div className="flex items-center justify-between p-4 border-b">
        {canGoBack && (
          <button onClick={goBack}>← Back</button>
        )}
        <h2>Custom Panel</h2>
        <button onClick={closePanel}>✕</button>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4">
        {/* Your custom content */}
      </div>
    </div>
  )
}

// 2. Register in panel system
// 3. Add TypeScript types
// 4. Create documentation
// 5. Add tests
```

### Component Guidelines
- **Single Responsibility**: Each component has one clear purpose
- **Responsive Design**: Works on all device sizes
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: Memoization and lazy loading where appropriate
- **Testing**: Comprehensive test coverage
- **Documentation**: Clear usage examples and API docs

---

## 🚀 **Building the Future**

These components form the foundation of a revolutionary e-commerce interface. They're designed to be:

- **🧩 Modular**: Use only what you need
- **🔧 Extensible**: Easy to customize and extend
- **⚡ Performant**: Optimized for speed and efficiency
- **♿ Accessible**: Inclusive design for all users
- **🧪 Testable**: Built with testing in mind

Ready to explore the individual components and build amazing shopping experiences! 🌟