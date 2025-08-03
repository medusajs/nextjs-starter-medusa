# 🧩 Components Overview

## Introduction

The Companion Panel System is built from modular, reusable components that work together to create a seamless user experience. Each component has a specific responsibility and can be customized or extended as needed.

## 🏗️ Component Architecture

```
CompanionPanelProvider (Context)
├── CartTriggerButton (Trigger)
├── CompanionPanel (Universal Renderer)
│   ├── CartDrawerPanel (Cart Implementation)
│   ├── AIAssistantPanel (AI Chat Interface)
│   ├── HelpPanel (Support Interface)
│   └── CustomPanels (Extensible)
├── ResponsivePageWrapper (Layout Manager)
└── PanelDemoButtons (Development Tool)
```

## 🎯 Core Components

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
**Purpose**: Smart cart trigger with visual feedback
**File**: `src/modules/layout/components/cart-trigger-button/index.tsx`

**Key Features**:
- Dynamic item count display
- Visual state feedback (shows when cart is open)
- Accessibility attributes
- Responsive behavior

```typescript
// Usage
<CartTriggerButton cart={cartData} />

// Props
interface CartTriggerButtonProps {
  cart?: HttpTypes.StoreCart | null
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