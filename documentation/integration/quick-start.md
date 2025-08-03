# 🚀 5-Minute Quick Start Guide

Get the Companion Panel System up and running in your e-commerce app in just 5 minutes!

## ⚡ Prerequisites

- React 18+ application
- TypeScript (recommended)
- Tailwind CSS
- Next.js (for server components)

## 📦 Step 1: Verify Installation

The Companion Panel System is already integrated into your project! The components are located in:

```
src/
├── lib/context/
│   └── companion-panel-context.tsx      # Global state
├── modules/layout/components/
│   ├── companion-panel/                 # Panel renderer
│   ├── cart-drawer/                     # Cart implementation
│   ├── cart-trigger-button/             # Trigger button
│   ├── cart-button/                     # Server wrapper
│   └── responsive-page-wrapper/         # Layout manager
```

## 🏗️ Step 2: Basic Setup

### Wrap Your App with the Provider

The provider should already be integrated in your main layout:

```typescript
// src/app/[countryCode]/(main)/layout.tsx (Already implemented!)
import { CompanionPanelProvider } from "@lib/context/companion-panel-context"

export default async function PageLayout({ children }) {
  return (
    <CompanionPanelProvider>
      <Nav />
      <ResponsivePageWrapper>
        {children}
      </ResponsivePageWrapper>
      <Footer />
    </CompanionPanelProvider>
  )
}
```

### Add the Cart Button to Your Header

The cart button should already be in your navigation:

```typescript
// src/modules/layout/templates/nav/index.tsx (Already implemented!)
import CartButton from "@modules/layout/components/cart-button"

export default async function Nav() {
  return (
    <nav>
      {/* Other nav items */}
      <CartButton /> {/* Smart cart trigger + panel renderer */}
    </nav>
  )
}
```

## 🎯 Step 3: Test the Basic Functionality

Your cart should now work as a companion panel! Test it:

1. **Desktop (≥768px)**: Click cart → panel slides out from right, content compresses
2. **Mobile (<768px)**: Click cart → full-screen overlay modal
3. **Navigation**: ESC to close, click outside to close (mobile)

## 🤖 Step 4: Add Your First Custom Panel

Let's add a simple AI assistant trigger to see the system in action:

```typescript
// Add this to any component
import { useCompanionPanel } from "@lib/context/companion-panel-context"

function AIHelperButton() {
  const { openPanel } = useCompanionPanel()
  
  const handleAIHelp = () => {
    openPanel('ai-assistant', {
      context: 'general-help',
      userQuery: 'I need help finding products',
      timestamp: Date.now()
    }, 'AI Shopping Assistant')
  }
  
  return (
    <button 
      onClick={handleAIHelp}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      🤖 Get AI Help
    </button>
  )
}
```

## 🔄 Step 5: Test Panel Navigation

Add multiple panel triggers to test the history navigation:

```typescript
function PanelTestButtons() {
  const { openPanel, goBack, canGoBack, currentPanel } = useCompanionPanel()
  
  return (
    <div className="flex gap-2 p-4">
      {/* Panel triggers */}
      <button onClick={() => openPanel('cart')}>
        🛒 Cart
      </button>
      
      <button onClick={() => openPanel('ai-assistant', { context: 'help' })}>
        🤖 AI Help
      </button>
      
      <button onClick={() => openPanel('help', { topic: 'shipping' })}>
        ❓ Help
      </button>
      
      <button onClick={() => openPanel('wishlist')}>
        ❤️ Wishlist
      </button>
      
      {/* Navigation */}
      <button 
        onClick={goBack} 
        disabled={!canGoBack}
        className="bg-gray-500 text-white px-3 py-1 rounded disabled:opacity-50"
      >
        ← Back
      </button>
      
      {/* Status */}
      <span className="text-sm text-gray-600">
        Current: {currentPanel?.type || 'None'}
      </span>
    </div>
  )
}
```

## 📱 Step 6: Test Responsive Behavior

1. **Desktop Test**: 
   - Open browser at 1024px+ width
   - Click panels → should see side panels with content compression
   - Try keyboard shortcuts: ESC to close, Alt+← to go back

2. **Mobile Test**:
   - Resize browser to <768px or use device tools
   - Click panels → should see full-screen overlay modals
   - Test touch interactions and backdrop tap to close

## 🎨 Step 7: Customize Your First Panel (Optional)

Create a simple custom panel to understand the system:

```typescript
// src/components/custom-panel.tsx
import { useCompanionPanel } from "@lib/context/companion-panel-context"

function CustomPanelContent({ data }: { data?: any }) {
  const { closePanel, goBack, canGoBack } = useCompanionPanel()
  
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {canGoBack && (
          <button onClick={goBack} className="text-blue-500">
            ← Back
          </button>
        )}
        <h2 className="text-lg font-semibold">Custom Panel</h2>
        <button onClick={closePanel} className="text-gray-500">
          ✕
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4">
        <p>This is a custom panel!</p>
        <p>Data received: {JSON.stringify(data, null, 2)}</p>
      </div>
    </div>
  )
}

export default CustomPanelContent
```

Register it in the panel renderer:

```typescript
// src/modules/layout/components/companion-panel/index.tsx
import CustomPanelContent from "@components/custom-panel"

const PanelComponents = {
  'cart': CartDrawerPanel,
  'ai-assistant': () => <div className="p-4">AI Assistant (Coming Soon)</div>,
  'help': () => <div className="p-4">Help Panel (Coming Soon)</div>,
  'custom': CustomPanelContent, // Add your custom panel
  // ... other panels
}
```

Use it:
```typescript
openPanel('custom', { message: 'Hello from custom panel!' })
```

## ✅ Verification Checklist

Make sure everything works:

- [ ] **Cart opens correctly** on both desktop and mobile
- [ ] **Content compresses** on desktop when panel opens
- [ ] **Mobile overlay** works with backdrop blur
- [ ] **Navigation works**: ESC to close, Alt+← for back navigation
- [ ] **Multiple panels** can be opened with history navigation
- [ ] **Panel data** is passed correctly between components

## 🚀 You're Ready!

Congratulations! You now have a fully functional Companion Panel System. Here's what you can do next:

### Immediate Next Steps
1. **[Explore Panel Types](../companion-panel/panel-types.md)** - Learn about all available panels
2. **[Build AI Workflows](../companion-panel/workflows.md)** - Create complex user journeys
3. **[Customize Components](../components/index.md)** - Adapt panels to your brand

### Advanced Features
1. **[Custom Panels](../guides/custom-panels.md)** - Build your own panel types
2. **[Analytics Integration](../guides/analytics-integration.md)** - Track user workflows
3. **[Performance Optimization](../development/performance-monitoring.md)** - Optimize for scale

## 🆘 Need Help?

- **Common Issues**: [Troubleshooting Guide](../troubleshooting/index.md)
- **API Reference**: [Complete API Docs](../companion-panel/api-reference.md)
- **Examples**: [Real-world Examples](./examples.md)

## 💡 Pro Tips

### Development Shortcuts
```typescript
// Add this for easy testing during development
function DevPanelControls() {
  if (process.env.NODE_ENV !== 'development') return null
  
  return <PanelTestButtons /> // Your test buttons
}
```

### Performance Tip
```typescript
// Lazy load heavy panel components
const LazyAIPanel = lazy(() => import('./ai-assistant-panel'))

// Use in panel renderer with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <LazyAIPanel />
</Suspense>
```

### Debugging Tip
The system includes built-in development logging. Open your browser console to see detailed panel state changes during development.

---

## 🎉 **Welcome to the Future of E-commerce UX!**

You've just implemented a revolutionary interface pattern that will transform how users interact with your e-commerce site. The Companion Panel System provides the foundation for AI-driven shopping experiences that maintain context and guide users through complex purchase decisions.

**Ready to build the next generation of shopping experiences!** 🌟