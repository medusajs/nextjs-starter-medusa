# 🏗️ Layout System Overview

## Introduction

The Companion Panel System uses a sophisticated responsive layout architecture that seamlessly transforms between mobile overlay and desktop split-view experiences. This creates the foundation for context-preserving, AI-driven e-commerce workflows.

## 🎯 Layout Philosophy

### Traditional Modal Problems
- **Context Interruption**: Overlays block content and break user flow
- **Single-Purpose Limitation**: Each modal serves only one function
- **Poor Mobile Experience**: Overlays feel awkward on small screens
- **No Workflow Memory**: Can't navigate between related tasks

### Companion Panel Solutions
- **Context Preservation**: Main content remains visible and interactive
- **Multi-Purpose Workflow**: Seamless navigation between panels
- **Device-Optimized Experience**: Perfect behavior on any screen size
- **Workflow Continuity**: Maintain state through complex user journeys

## 📐 Layout Architecture Components

### Core Layout Components

#### 1. **CompanionPanelProvider**
**Purpose**: Global layout state management
**Location**: `src/lib/context/companion-panel-context.tsx`

```typescript
// Manages responsive breakpoints and global panel state
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

#### 2. **ResponsivePageWrapper**
**Purpose**: Main content area compression management
**Location**: `src/modules/layout/components/responsive-page-wrapper/index.tsx`

```typescript
// Automatically compresses content on desktop when panels open
<div className={`transition-all duration-300 ease-in-out ${
  isOpen 
    ? "md:mr-96 lg:mr-[400px]" // Make space for panel
    : "mr-0"
}`}>
  {children}
</div>
```

#### 3. **Panel Positioning System**
**Purpose**: Handles panel positioning across devices
**Behavior**: 
- **Mobile**: Full-screen overlay modals
- **Desktop**: Fixed side panels with content compression

## 📱 Responsive Behavior Modes

### Mobile Mode (< 768px)
```css
/* Full-screen overlay modal */
.mobile-panel {
  position: fixed;
  inset: 0;
  z-index: 75;
  
  /* Backdrop with blur */
  background: rgba(17, 24, 39, 0.5);
  backdrop-filter: blur(8px);
  
  /* Slide animation */
  .panel-container {
    transform: translateX(100%);
    transition: transform 300ms ease-in-out;
    
    &.open {
      transform: translateX(0);
    }
  }
}
```

**Features:**
- Full-screen overlay with backdrop blur
- Right-to-left slide animation
- Touch-optimized interactions
- Hardware back button support (Android)
- iOS safe area support

### Desktop Mode (≥ 768px)
```css
/* Fixed side panel with content compression */
.desktop-panel {
  position: fixed;
  top: 4rem;    /* Below header */
  right: 0;
  height: calc(100vh - 4rem);
  width: 24rem; /* 384px on md, 400px on lg */
  
  /* Styling */
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

**Features:**
- Fixed side panels (384px-400px wide)
- Content compression with smooth transitions
- Persistent visibility while browsing
- Keyboard shortcuts and navigation
- Subtle backdrop for visual separation

## 🎨 Visual Design System

### Breakpoint Strategy
```typescript
const breakpoints = {
  mobile: '< 768px',   // Overlay modals
  tablet: '768px',     // Split-view begins (384px panels)
  desktop: '1024px',   // Wider panels (400px)
  large: '1280px+',    // Enhanced layouts
}
```

### Animation System
```css
/* Hardware-accelerated transitions */
.layout-transition {
  transition-property: margin-right, transform;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  will-change: margin-right, transform;
  backface-visibility: hidden;
}

/* Panel slide animations */
.panel-slide {
  transform: translateX(100%);
  transition: transform 300ms ease-in-out;
  
  &.open {
    transform: translateX(0);
  }
}
```

### Z-Index Hierarchy
```css
/* Proper layering for all UI elements */
:root {
  --z-header: 50;           /* Navigation header */
  --z-panel-mobile: 75;     /* Mobile modal panels */
  --z-panel-desktop: 40;    /* Desktop side panels */
  --z-backdrop: 30;         /* Desktop backdrop */
  --z-content: 10;          /* Main content */
}
```

## 📊 Layout Metrics & Performance

### Performance Targets
- **Panel Open**: < 16ms (60fps smooth)
- **Content Compression**: < 300ms transition
- **Responsive Switch**: < 100ms device detection
- **Memory Usage**: < 1MB layout overhead

### Browser Support
- **Chrome/Edge**: 90+ ✅
- **Firefox**: 88+ ✅
- **Safari**: 14+ ✅
- **iOS Safari**: 14+ ✅
- **Chrome Mobile**: 90+ ✅

## 🔧 Layout Integration Patterns

### Header Integration
```typescript
// Navigation header stays fixed during panel operations
<header className="sticky top-0 inset-x-0 z-50">
  <nav className="h-16">
    <CartTriggerButton />
  </nav>
</header>

// Panels position below header
<div className="fixed top-16 right-0 h-[calc(100vh-4rem)]">
  {/* Panel content */}
</div>
```

### Content Flow Management
```typescript
// All page content automatically adapts
<ResponsivePageWrapper>
  <ProductGrid />      {/* Compresses on desktop */}
  <CategoryPages />    {/* Maintains mobile layout */}
  <CheckoutFlow />     {/* Responsive to panel state */}
</ResponsivePageWrapper>
```

### Footer Behavior
```typescript
// Footer flows naturally with compressed content
<footer className="mt-auto">
  {/* Footer adapts to layout compression */}
</footer>
```

## 🎯 Layout Customization

### Custom Breakpoints
```typescript
// Override default breakpoints
const customBreakpoints = {
  mobile: 640,    // Custom mobile breakpoint
  tablet: 900,    // Custom tablet breakpoint
  desktop: 1200   // Custom desktop breakpoint
}

// Use in your components
const useCustomBreakpoint = () => {
  const [deviceType, setDeviceType] = useState('mobile')
  
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      if (width >= customBreakpoints.desktop) setDeviceType('desktop')
      else if (width >= customBreakpoints.tablet) setDeviceType('tablet')
      else setDeviceType('mobile')
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])
  
  return deviceType
}
```

### Custom Panel Widths
```css
/* Customize panel widths */
.custom-panel-widths {
  /* Small panels */
  --panel-width-sm: 20rem;  /* 320px */
  
  /* Default panels */
  --panel-width-md: 24rem;  /* 384px */
  
  /* Large panels */
  --panel-width-lg: 28rem;  /* 448px */
  
  /* Extra large panels */
  --panel-width-xl: 32rem;  /* 512px */
}

/* Apply to specific panel types */
.panel-ai-assistant {
  width: var(--panel-width-lg); /* Wider for AI conversations */
}

.panel-cart {
  width: var(--panel-width-md); /* Standard width */
}
```

## 📚 Documentation Sections

Explore detailed documentation for each aspect of the layout system:

### [📱 Responsive Design](./responsive-design.md)
Deep dive into mobile vs desktop behavior, breakpoint management, and device-specific optimizations.

### [🎬 Animations](./animations.md)
Complete guide to CSS transitions, hardware acceleration, performance optimization, and custom animations.

### [📍 Positioning](./positioning.md)
Panel positioning strategies, z-index management, and layout coordination across components.

### [♿ Accessibility](./accessibility.md)
Accessibility considerations, keyboard navigation, screen reader support, and inclusive design patterns.

## 🚀 Advanced Layout Features

### Dynamic Panel Sizing
```typescript
// Panels can adapt their size based on content
const useDynamicPanelSize = (content: any) => {
  const [panelWidth, setPanelWidth] = useState('24rem')
  
  useEffect(() => {
    const calculateOptimalWidth = (content: any) => {
      // AI conversation = wider panel
      if (content?.type === 'ai-assistant') return '28rem'
      
      // Simple cart = standard width
      if (content?.type === 'cart') return '24rem'
      
      // Complex comparison = extra wide
      if (content?.type === 'product-compare' && content?.products?.length > 2) {
        return '32rem'
      }
      
      return '24rem'
    }
    
    setPanelWidth(calculateOptimalWidth(content))
  }, [content])
  
  return panelWidth
}
```

### Multi-Panel Layouts (Future)
```typescript
// Foundation for multiple panels simultaneously
const MultiPanelLayout = () => {
  const [panels, setPanels] = useState<PanelState[]>([])
  
  // Future: Support for multiple panels
  // Primary panel (400px) + Secondary panel (300px)
  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] flex">
      {panels.map((panel, index) => (
        <PanelRenderer key={panel.id} panel={panel} index={index} />
      ))}
    </div>
  )
}
```

---

## 🌟 **Next Steps**

The layout system provides the foundation for revolutionary e-commerce experiences. Explore the detailed documentation to master each aspect:

1. **[Responsive Design](./responsive-design.md)** - Master mobile and desktop layouts
2. **[Animations](./animations.md)** - Create smooth, performant transitions
3. **[Positioning](./positioning.md)** - Perfect panel placement and coordination
4. **[Accessibility](./accessibility.md)** - Ensure inclusive user experiences

The future of e-commerce interfaces is context-preserving, AI-driven, and beautifully responsive! 🚀