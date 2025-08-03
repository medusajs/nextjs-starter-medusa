# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 1. Panel Not Opening

#### Symptoms
- Clicking cart/panel triggers doesn't open panel
- No visual feedback when triggering panels
- Console errors about missing context

#### Solutions

**Check Provider Setup**
```typescript
// ❌ Missing provider
function App() {
  return <CartTriggerButton /> // Context error!
}

// ✅ Correct setup
function App() {
  return (
    <CompanionPanelProvider>
      <CartTriggerButton />
      <CompanionPanel />
    </CompanionPanelProvider>
  )
}
```

**Verify Hook Usage**
```typescript
// ❌ Wrong hook usage
function Component() {
  const panel = useCompanionPanel() // Outside provider
}

// ✅ Correct usage
function Component() {
  const { openPanel } = useCompanionPanel() // Inside provider
  
  return (
    <button onClick={() => openPanel('cart')}>
      Open Cart
    </button>
  )
}
```

**Check Panel Registration**
```typescript
// Ensure panel is registered in CompanionPanel component
const PanelComponents = {
  'cart': CartDrawerPanel,
  'your-panel': YourPanelComponent, // Must be registered
}
```

### 2. Layout/Animation Issues

#### Symptoms
- Jerky or slow animations
- Content not compressing properly
- Panel appears behind other elements
- Mobile overlay not working

#### Solutions

**Enable Hardware Acceleration**
```css
/* Add to your CSS */
.panel-container {
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0);
}
```

**Check Z-index Hierarchy**
```css
/* Ensure proper stacking */
.header { z-index: 50; }
.panel-desktop { z-index: 40; }
.panel-mobile { z-index: 75; }
.backdrop { z-index: 30; }
```

**Verify ResponsivePageWrapper**
```typescript
// ❌ Missing wrapper
function Layout() {
  return <YourPageContent /> // Won't compress
}

// ✅ Correct setup
function Layout() {
  return (
    <ResponsivePageWrapper>
      <YourPageContent /> {/* Will compress on desktop */}
    </ResponsivePageWrapper>
  )
}
```

### 3. Mobile-Specific Issues

#### Symptoms
- Panel doesn't appear on mobile
- Backdrop not blurred
- Touch interactions not working
- Panel appears incorrectly sized

#### Solutions

**Check Viewport Meta Tag**
```html
<!-- Required in your HTML head -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Verify Mobile Detection**
```typescript
// Debug mobile detection
const { isMobile } = useCompanionPanel()
console.log('Is Mobile:', isMobile, 'Width:', window.innerWidth)
```

**Check CSS Support**
```css
/* Fallback for backdrop-filter */
@supports (backdrop-filter: blur(8px)) {
  .mobile-backdrop {
    backdrop-filter: blur(8px);
  }
}

@supports not (backdrop-filter: blur(8px)) {
  .mobile-backdrop {
    background: rgba(17, 24, 39, 0.8); /* Fallback */
  }
}
```

### 4. State Management Problems

#### Symptoms
- Panel history not working
- Back navigation broken
- State updates not reflecting
- Memory leaks

#### Solutions

**Check History Management**
```typescript
// Debug history state
const { panelHistory, canGoBack, historyCount } = useCompanionPanel()

useEffect(() => {
  console.log('Panel History Debug:', {
    current: currentPanel?.type,
    history: panelHistory.map(p => p.type),
    canGoBack,
    historyCount
  })
}, [panelHistory, currentPanel, canGoBack, historyCount])
```

**Verify State Updates**
```typescript
// Use functional updates for reliability
const { openPanel } = useCompanionPanel()

// ❌ Direct state reference (can be stale)
const handleToggle = () => {
  if (isOpen) close()
  else open()
}

// ✅ Functional approach
const handleToggle = () => {
  if (isOpen && currentPanel?.type === 'cart') {
    closePanel()
  } else {
    openPanel('cart')
  }
}
```

### 5. Performance Issues

#### Symptoms
- Slow panel animations
- App becomes laggy when panels open
- High memory usage
- Render performance warnings

#### Solutions

**Optimize Re-renders**
```typescript
// ❌ Causes unnecessary re-renders
function Component() {
  const panelState = useCompanionPanel() // Entire context
  return <div>{panelState.isOpen ? 'Open' : 'Closed'}</div>
}

// ✅ Extract only needed values
function Component() {
  const { isOpen } = useCompanionPanel() // Only what's needed
  return <div>{isOpen ? 'Open' : 'Closed'}</div>
}
```

**Lazy Load Heavy Panels**
```typescript
// Lazy load expensive panel components
const LazyAIPanel = lazy(() => import('./ai-assistant-panel'))

function CompanionPanel() {
  return (
    <Suspense fallback={<PanelSkeleton />}>
      {currentPanel?.type === 'ai-assistant' && (
        <LazyAIPanel data={currentPanel.data} />
      )}
    </Suspense>
  )
}
```

**Memoize Expensive Operations**
```typescript
// Memoize complex computations
const expensiveData = useMemo(() => {
  return computeExpensiveData(panelData)
}, [panelData])

// Memoize event handlers
const handlePanelOpen = useCallback((type: PanelType) => {
  openPanel(type)
}, [openPanel])
```

### 6. TypeScript Issues

#### Symptoms
- Type errors in panel data
- Missing type definitions
- Autocomplete not working
- Build-time type errors

#### Solutions

**Extend Panel Types**
```typescript
// Create proper type definitions
declare module '@lib/context/companion-panel-context' {
  interface PanelDataTypes {
    'cart': {
      items: CartItem[]
      source: string
    }
    'ai-assistant': {
      query: string
      context: string
    }
  }
}
```

**Use Type Guards**
```typescript
// Type-safe panel data access
function isCartPanel(panel: PanelState): panel is PanelState & { 
  type: 'cart'
  data: { items: CartItem[] }
} {
  return panel.type === 'cart'
}

// Usage
if (isCartPanel(currentPanel)) {
  // currentPanel.data is now typed as cart data
  console.log(currentPanel.data.items)
}
```

### 7. Testing Issues

#### Symptoms
- Tests failing with context errors
- Mock providers not working
- Animation tests timing out
- State assertions failing

#### Solutions

**Proper Test Setup**
```typescript
// Create test wrapper
const createTestWrapper = (initialState?: Partial<CompanionPanelContextType>) => {
  return ({ children }: { children: React.ReactNode }) => (
    <CompanionPanelProvider>
      {children}
    </CompanionPanelProvider>
  )
}

// Use in tests
test('panel opens correctly', () => {
  render(<TestComponent />, {
    wrapper: createTestWrapper()
  })
})
```

**Mock Responsive Behavior**
```typescript
// Mock window dimensions for responsive tests
beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024, // Desktop width
  })
})
```

**Handle Async Operations**
```typescript
// Wait for panel animations
test('panel animates correctly', async () => {
  render(<TestComponent />)
  
  fireEvent.click(screen.getByText('Open Panel'))
  
  await waitFor(() => {
    expect(screen.getByTestId('panel')).toHaveClass('translate-x-0')
  }, { timeout: 500 }) // Allow for animation time
})
```

## Debug Tools

### 1. Development Console Logging
```typescript
// Enable detailed logging in development
if (process.env.NODE_ENV === 'development') {
  // Automatic logging is enabled in the context
}

// Custom debug logging
const debugPanel = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔄 Panel Debug: ${message}`, data)
  }
}
```

### 2. State Inspector Component
```typescript
import PanelDemoButtons from '@modules/layout/components/panel-demo-buttons'

function DevelopmentTools() {
  if (process.env.NODE_ENV !== 'development') return null
  
  return (
    <>
      <PanelDemoButtons /> {/* Bottom-left corner controls */}
      <PanelStateInspector /> {/* Real-time state display */}
    </>
  )
}
```

### 3. Performance Monitoring
```typescript
// Monitor panel performance
const usePanelPerformanceMonitor = () => {
  const { currentPanel, isOpen } = useCompanionPanel()
  
  useEffect(() => {
    if (isOpen && currentPanel) {
      const startTime = performance.now()
      
      requestAnimationFrame(() => {
        const renderTime = performance.now() - startTime
        
        if (renderTime > 16) { // > 60fps
          console.warn(`⚠️ Panel ${currentPanel.type} render slow: ${renderTime}ms`)
        }
      })
    }
  }, [isOpen, currentPanel])
}
```

## Browser Compatibility Issues

### Safari Issues
```css
/* Safari-specific fixes */
.panel {
  /* Fix for Safari transform issues */
  -webkit-transform: translateX(100%);
  transform: translateX(100%);
  
  /* Fix for Safari backdrop-filter */
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}
```

### iOS Safari Issues
```css
/* Fix for iOS viewport issues */
.panel-mobile {
  /* Account for iOS safe areas */
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  
  /* Fix for iOS scroll bounce */
  -webkit-overflow-scrolling: touch;
}
```

### Firefox Issues
```css
/* Firefox scrollbar styling */
.panel-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}
```

## Environment-Specific Issues

### Next.js Issues
```typescript
// Handle SSR/hydration issues
const [isClient, setIsClient] = useState(false)

useEffect(() => {
  setIsClient(true)
}, [])

if (!isClient) {
  return null // Avoid hydration mismatch
}
```

### Build Issues
```typescript
// Handle dynamic imports properly
const PanelComponent = dynamic(
  () => import(`./panels/${panelType}`),
  { ssr: false } // Disable SSR for panel components
)
```

## Quick Diagnostic Checklist

### ✅ Basic Setup
- [ ] CompanionPanelProvider wraps your app
- [ ] CompanionPanel component is rendered
- [ ] Panel components are registered
- [ ] ResponsivePageWrapper wraps main content

### ✅ State Management
- [ ] useCompanionPanel hook is used correctly
- [ ] Panel data is passed properly
- [ ] History navigation works
- [ ] State updates are reflected in UI

### ✅ Responsive Design
- [ ] Mobile detection works (< 768px)
- [ ] Desktop layout compresses content
- [ ] Viewport meta tag is present
- [ ] CSS breakpoints are correct

### ✅ Performance
- [ ] Animations are smooth (60fps)
- [ ] No memory leaks
- [ ] Re-renders are optimized
- [ ] Large components are lazy loaded

### ✅ Accessibility
- [ ] Keyboard navigation works
- [ ] Screen readers can access content
- [ ] Focus management is correct
- [ ] ARIA attributes are present

---

## 🚨 Emergency Fixes

### Complete System Reset
```typescript
// Nuclear option: reset all panel state
const { closePanel, clearHistory } = useCompanionPanel()

const resetPanelSystem = () => {
  closePanel()
  clearHistory()
  
  // Clear any localStorage
  localStorage.removeItem('companion-panel-state')
  
  // Force re-render
  window.location.reload()
}
```

### Disable Animations (Performance Issues)
```css
/* Temporarily disable all animations */
.panel * {
  transition: none !important;
  animation: none !important;
}
```

### Force Mobile Mode
```typescript
// Force mobile layout for debugging
const useForceMobile = () => {
  return { ...useCompanionPanel(), isMobile: true }
}
```

Need more help? Check the [main documentation](./README.md) or open an issue in the repository! 🆘