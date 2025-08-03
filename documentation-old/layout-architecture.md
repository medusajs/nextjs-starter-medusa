# 🏗️ Layout Architecture

## Overview

The Companion Panel System uses a sophisticated responsive layout architecture that seamlessly transforms between mobile overlay and desktop split-view experiences. This document details the layout components, CSS architecture, and responsive behavior.

## Layout Components

### 1. CompanionPanelProvider
**Location**: `src/lib/context/companion-panel-context.tsx`
**Purpose**: Global layout state management

```typescript
interface CompanionPanelContextType {
  isOpen: boolean           // Panel visibility
  currentPanel: PanelState  // Active panel data
  isMobile: boolean         // Responsive breakpoint state
  // ... other properties
}
```

**Responsive Breakpoint**:
```typescript
const checkIsMobile = () => {
  setIsMobile(window.innerWidth < 768) // Tailwind md breakpoint
}
```

### 2. ResponsivePageWrapper  
**Location**: `src/modules/layout/components/responsive-page-wrapper/index.tsx`
**Purpose**: Main content area compression management

```typescript
// Desktop: Compresses main content when panel opens
<div className={`transition-all duration-300 ease-in-out ${
  isOpen 
    ? "md:mr-96 lg:mr-[400px]" // Make space for panel
    : "mr-0"
}`}>
  {children}
</div>
```

**Layout Behavior**:
- **Mobile**: No compression (panels use overlay)
- **Tablet (md)**: 384px right margin when panel open
- **Desktop (lg)**: 400px right margin when panel open

### 3. Panel Positioning System

#### Mobile Layout (< 768px)
```css
/* Full-screen overlay modal */
.mobile-panel {
  position: fixed;
  inset: 0;
  z-index: 75;
  
  /* Backdrop */
  background: rgba(17, 24, 39, 0.5);
  backdrop-filter: blur(8px);
  
  /* Panel container */
  .panel-container {
    position: fixed;
    inset-y: 0;
    right: 0;
    max-width: 28rem; /* 448px */
    
    /* Slide animation */
    transform: translateX(100%);
    transition: transform 300ms ease-in-out;
    
    &.open {
      transform: translateX(0);
    }
  }
}
```

#### Desktop Layout (≥ 768px)
```css
/* Fixed side panel */
.desktop-panel {
  position: fixed;
  top: 4rem;    /* Below header */
  right: 0;
  height: calc(100vh - 4rem);
  width: 24rem; /* 384px on md */
  
  @media (min-width: 1024px) {
    width: 25rem; /* 400px on lg */
  }
  
  /* Panel styling */
  background: white;
  box-shadow: -4px 0 6px -1px rgba(0, 0, 0, 0.1);
  border-left: 1px solid rgb(229, 231, 235);
  z-index: 40;
  
  /* Slide animation */
  transform: translateX(100%);
  transition: transform 300ms ease-in-out;
  
  &.open {
    transform: translateX(0);
  }
}
```

## Responsive Design System

### Breakpoint Strategy
```typescript
// Tailwind CSS breakpoints used
const breakpoints = {
  sm: '640px',   // Small devices (unused in panels)
  md: '768px',   // Tablet - enables split-view
  lg: '1024px',  // Desktop - wider panels
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
}
```

### Layout Modes

#### 1. Mobile Mode (< 768px)
- **Panel Behavior**: Full-screen overlay modal
- **Main Content**: No compression, stays full-width
- **Animation**: Right-to-left slide-in
- **Interaction**: Touch-optimized, backdrop tap to close

#### 2. Tablet Mode (768px - 1023px)  
- **Panel Behavior**: Fixed side column (384px wide)
- **Main Content**: Compresses with 384px right margin
- **Animation**: Slide-in from right edge
- **Interaction**: Mouse + touch hybrid

#### 3. Desktop Mode (≥ 1024px)
- **Panel Behavior**: Fixed side column (400px wide)
- **Main Content**: Compresses with 400px right margin  
- **Animation**: Smooth slide-in transition
- **Interaction**: Mouse-optimized, keyboard shortcuts

## CSS Architecture

### Animation System
```css
/* Smooth transitions for all layout changes */
.layout-transition {
  transition-property: margin-right, transform;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Panel slide animations */
.panel-enter {
  transform: translateX(100%);
}

.panel-enter-active {
  transform: translateX(0);
  transition: transform 300ms ease-in-out;
}

.panel-exit {
  transform: translateX(0);
}

.panel-exit-active {
  transform: translateX(100%);
  transition: transform 300ms ease-in-out;
}
```

### Z-Index Hierarchy
```css
/* Layout z-index stack */
.layout-stack {
  --z-header: 50;           /* Navigation header */
  --z-panel-desktop: 40;    /* Desktop panel */
  --z-backdrop: 30;         /* Desktop backdrop */
  --z-panel-mobile: 75;     /* Mobile modal */
  --z-demo-buttons: 50;     /* Development tools */
}
```

### Backdrop System
```css
/* Desktop subtle backdrop */
.desktop-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.05);
  z-index: 30;
  pointer-events: none; /* Allow interaction with main content */
  
  opacity: 0;
  transition: opacity 300ms ease-in-out;
  
  &.visible {
    opacity: 1;
  }
}

/* Mobile full backdrop */
.mobile-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.5);
  backdrop-filter: blur(8px);
  z-index: 75;
  
  opacity: 0;
  transition: opacity 300ms ease-in-out;
  
  &.visible {
    opacity: 1;
  }
}
```

## Layout Integration

### Header Integration
```typescript
// Navigation header stays fixed during panel operations
<header className="sticky top-0 inset-x-0 z-50">
  <nav className="h-16">
    {/* Cart trigger button */}
    <CartTriggerButton />
  </nav>
</header>

// Panels position below header
<div className="fixed top-16 right-0 h-[calc(100vh-4rem)]">
  {/* Panel content */}
</div>
```

### Footer Behavior
```typescript
// Footer flows naturally with content compression
<footer className="mt-auto">
  {/* Footer content adapts to compressed layout */}
</footer>
```

### Content Flow Management
```typescript
// Pages automatically adapt to companion panel
<ResponsivePageWrapper>
  {/* All page content automatically compresses */}
  <ProductGrid />
  <CategoryPages />
  <CheckoutFlow />
</ResponsivePageWrapper>
```

## Performance Optimizations

### Hardware Acceleration
```css
/* Enable GPU acceleration for smooth animations */
.panel {
  transform: translateX(100%);
  will-change: transform;
  backface-visibility: hidden;
  perspective: 1000px;
}

.layout-container {
  margin-right: 0;
  will-change: margin-right;
  transform: translateZ(0); /* Force GPU layer */
}
```

### Efficient Transitions
```css
/* Use transform instead of position changes */
.efficient-slide {
  transform: translateX(100%); /* Better than right: -400px */
  transition: transform 300ms ease-in-out;
}

/* Use margin instead of width changes */
.efficient-compression {
  margin-right: 0; /* Better than width: calc(100% - 400px) */
  transition: margin-right 300ms ease-in-out;
}
```

### Render Optimization
```typescript
// Conditional rendering to avoid unnecessary DOM
{isOpen && currentPanel && (
  <PanelRenderer panel={currentPanel} />
)}

// Lazy loading for heavy panel components
const LazyPanelComponent = lazy(() => 
  import(`./panels/${currentPanel.type}`)
)
```

## Accessibility Considerations

### Focus Management
```typescript
// Trap focus within panel when open
useEffect(() => {
  if (isOpen && panelRef.current) {
    const focusableElements = panelRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    // Focus first element
    focusableElements[0]?.focus()
    
    // Trap focus within panel
    const handleTabKey = (e: KeyboardEvent) => {
      // Focus trapping logic
    }
    
    document.addEventListener('keydown', handleTabKey)
    return () => document.removeEventListener('keydown', handleTabKey)
  }
}, [isOpen])
```

### Screen Reader Support
```html
<!-- Panel container with proper ARIA attributes -->
<div
  role="dialog"
  aria-labelledby="panel-title"
  aria-describedby="panel-description"
  aria-modal={isMobile ? "true" : "false"}
>
  <h2 id="panel-title">Shopping Cart</h2>
  <div id="panel-description">Manage your selected items</div>
</div>
```

### Keyboard Navigation
```typescript
// Global keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // ESC to close or go back
    if (e.key === 'Escape' && isOpen) {
      if (canGoBack) goBack()
      else closePanel()
    }
    
    // Alt + Left Arrow to go back
    if (e.altKey && e.key === 'ArrowLeft' && canGoBack) {
      goBack()
    }
  }
  
  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [isOpen, canGoBack, goBack, closePanel])
```

## Testing Strategy

### Layout Testing
```typescript
// Responsive layout tests  
describe('Layout Responsiveness', () => {
  test('compresses content on desktop when panel opens', () => {
    render(<ResponsivePageWrapper>Content</ResponsivePageWrapper>)
    
    // Mock desktop viewport
    Object.defineProperty(window, 'innerWidth', { value: 1024 })
    
    // Open panel
    fireEvent.click(screen.getByTestId('cart-trigger-button'))
    
    // Check compression
    expect(screen.getByText('Content').closest('div'))
      .toHaveClass('md:mr-96 lg:mr-[400px]')
  })
  
  test('uses overlay on mobile', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', { value: 375 })
    
    // Panel should render as modal dialog
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
```

### Animation Testing
```typescript
// Animation performance tests
describe('Panel Animations', () => {
  test('completes slide animation within 300ms', async () => {
    const startTime = performance.now()
    
    fireEvent.click(screen.getByTestId('cart-trigger-button'))
    
    await waitFor(() => {
      expect(screen.getByTestId('cart-panel')).toHaveClass('translate-x-0')
    }, { timeout: 350 })
    
    const endTime = performance.now()
    expect(endTime - startTime).toBeLessThan(350)
  })
})
```

## Browser Compatibility

### CSS Feature Support
```css
/* Fallbacks for older browsers */
.panel {
  /* Modern: backdrop-filter */
  backdrop-filter: blur(8px);
  
  /* Fallback: solid background */
  background: rgba(17, 24, 39, 0.8);
}

/* Feature detection */
@supports (backdrop-filter: blur(8px)) {
  .panel {
    background: rgba(17, 24, 39, 0.5);
    backdrop-filter: blur(8px);
  }
}
```

### JavaScript Polyfills
```typescript
// ResizeObserver polyfill for older browsers
if (!window.ResizeObserver) {
  import('resize-observer-polyfill').then(({ default: ResizeObserver }) => {
    window.ResizeObserver = ResizeObserver
  })
}
```

## Troubleshooting

### Common Layout Issues

1. **Panel Not Sliding**: Check z-index conflicts
2. **Content Not Compressing**: Verify ResponsivePageWrapper integration  
3. **Jerky Animations**: Enable hardware acceleration with `will-change`
4. **Mobile Overlay Issues**: Check viewport meta tag
5. **Focus Trapping Problems**: Verify ARIA attributes and focus management

### Debug Tools
```typescript
// Development panel state inspector
if (process.env.NODE_ENV === 'development') {
  console.log('Layout Debug:', {
    isOpen,
    isMobile,
    currentPanel: currentPanel?.type,
    viewport: { width: window.innerWidth, height: window.innerHeight }
  })
}
```

---

## 🎯 Layout System Benefits

- **🎨 Seamless UX**: Smooth transitions maintain user focus
- **📱 Device Adaptive**: Optimal experience on any screen size  
- **⚡ Performance**: Hardware-accelerated animations
- **♿ Accessible**: Full keyboard and screen reader support
- **🔧 Maintainable**: Clean component architecture with clear separation of concerns

The layout architecture provides a solid foundation for modern AI-driven e-commerce experiences! 🚀