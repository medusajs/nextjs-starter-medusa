# 🔧 Troubleshooting Guide

## Common Issues Overview

The Companion Panel System is designed to be robust and reliable, but like any complex system, you might encounter issues during implementation or usage. This guide helps you quickly identify and resolve common problems.

## 🚨 Quick Diagnostics

### Is Your Issue Here?

- 🔴 **[Panel Won't Open](#panel-wont-open)** - Click events not working, no visual response
- 🔴 **[Layout Problems](#layout-problems)** - Jerky animations, incorrect positioning, z-index issues  
- 🔴 **[Mobile Issues](#mobile-issues)** - Touch problems, sizing issues, backdrop not working
- 🔴 **[State Problems](#state-problems)** - History not working, data not updating, memory leaks
- 🔴 **[Performance Issues](#performance-issues)** - Slow animations, high CPU usage, lag
- 🔴 **[TypeScript Errors](#typescript-errors)** - Type errors, missing definitions, build failures

## 🔍 Quick Problem Identification

### ✅ Basic System Health Check

Run this checklist to identify the problem area:

```typescript
// Add this to any component for debugging
function SystemHealthCheck() {
  const panelState = useCompanionPanel()
  
  useEffect(() => {
    console.log('🔍 System Health Check:', {
      // Context availability
      contextAvailable: !!panelState,
      
      // State values
      isOpen: panelState?.isOpen,
      currentPanel: panelState?.currentPanel?.type,
      isMobile: panelState?.isMobile,
      historyCount: panelState?.historyCount,
      
      // Browser environment
      viewport: { 
        width: window.innerWidth, 
        height: window.innerHeight 
      },
      
      // Provider setup
      hasProvider: !!panelState,
      
      // DOM elements
      panelElements: document.querySelectorAll('[data-testid*="panel"]').length,
      triggerElements: document.querySelectorAll('[data-testid*="cart-button"]').length
    })
  }, [panelState])
  
  if (process.env.NODE_ENV !== 'development') return null
  
  return (
    <div className="fixed top-4 left-4 bg-red-100 p-2 text-xs">
      Health Check (see console)
    </div>
  )
}
```

## 🔴 Panel Won't Open

### Symptoms
- Clicking cart/panel triggers doesn't open panel
- No visual feedback when triggering panels  
- Console errors about missing context
- Buttons appear to work but nothing happens

### Most Common Causes

#### 1. Missing Provider Setup
```typescript
// ❌ Problem: Missing provider
function App() {
  return <CartTriggerButton /> // Context error!
}

// ✅ Solution: Wrap with provider
function App() {
  return (
    <CompanionPanelProvider>
      <CartTriggerButton />
      <CompanionPanel />
    </CompanionPanelProvider>
  )
}
```

#### 2. Panel Renderer Not Included
```typescript
// ❌ Problem: Trigger without renderer
<CompanionPanelProvider>
  <CartTriggerButton /> {/* Button works */}
  {/* Missing: <CompanionPanel /> */}
</CompanionPanelProvider>

// ✅ Solution: Include both trigger and renderer
<CompanionPanelProvider>
  <CartTriggerButton />
  <CompanionPanel cart={cart} /> {/* This renders the panels */}
</CompanionPanelProvider>
```

#### 3. Incorrect Hook Usage
```typescript
// ❌ Problem: Hook outside provider
function Component() {
  const panel = useCompanionPanel() // Error: no provider
}

// ✅ Solution: Component inside provider tree
<CompanionPanelProvider>
  <Component /> {/* Now useCompanionPanel works */}
</CompanionPanelProvider>
```

### **Quick Fix**: [Panel Won't Open Solutions](./layout-issues.md#panel-wont-open)

## 🔴 Layout Problems

### Symptoms
- Jerky or slow animations
- Content not compressing properly on desktop
- Panel appears behind other elements
- Mobile overlay not covering full screen
- Z-index conflicts

### Most Common Causes

#### 1. Missing ResponsivePageWrapper
```typescript
// ❌ Problem: Content won't compress
function Layout() {
  return <YourPageContent /> // No compression
}

// ✅ Solution: Wrap with ResponsivePageWrapper
function Layout() {
  return (
    <ResponsivePageWrapper>
      <YourPageContent /> {/* Will compress on desktop */}
    </ResponsivePageWrapper>
  )
}
```

#### 2. Z-Index Conflicts
```css
/* Check these z-index values */
.your-header { z-index: 60; } /* Should be < 75 */
.your-modal { z-index: 80; }  /* Should be < 75 */
.some-dropdown { z-index: 100; } /* Conflicts with panels */

/* Panel z-indexes */
.panel-desktop { z-index: 40; }
.panel-mobile { z-index: 75; }
```

### **Quick Fix**: [Layout Issue Solutions](./layout-issues.md)

## 🔴 Mobile Issues

### Symptoms
- Panel doesn't appear on mobile devices
- Backdrop not blurred or incorrect
- Touch interactions not working
- Panel appears incorrectly sized
- iOS safe area problems

### **Quick Fix**: [Mobile-Specific Solutions](./mobile-issues.md)

## 🔴 State Problems

### Symptoms
- Panel history not working
- Back navigation broken
- State updates not reflecting in UI
- Memory leaks or performance degradation
- Data not persisting between panels

### **Quick Fix**: [State Management Solutions](./state-issues.md)

## 🔴 Performance Issues

### Symptoms
- Slow panel animations (< 60fps)
- High CPU usage when panels open
- App becomes laggy
- Memory usage increases over time
- Render performance warnings

### **Quick Fix**: [Performance Optimization Guide](../development/performance-monitoring.md)

## 🔴 TypeScript Errors

### Symptoms
- Type errors in panel data
- Missing type definitions
- Autocomplete not working
- Build-time type errors

### Common Solutions
```typescript
// Extend panel data types properly
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

## 🆘 Emergency Fixes

### Nuclear Option: Complete System Reset
```typescript
const { closePanel, clearHistory } = useCompanionPanel()

const resetPanelSystem = () => {
  closePanel()
  clearHistory()
  
  // Clear any localStorage
  localStorage.removeItem('companion-panel-state')
  
  // Force clean slate
  window.location.reload()
}
```

### Temporary: Disable All Animations
```css
/* Add to CSS for debugging */
.panel * {
  transition: none !important;
  animation: none !important;
}
```

### Debug Mode: Force Mobile Layout
```typescript
// Temporarily force mobile for testing
const useForceMobile = () => {
  return { ...useCompanionPanel(), isMobile: true }
}
```

## 📚 Detailed Troubleshooting Guides

### [🏗️ Layout Issues](./layout-issues.md)
- Panel positioning problems
- Animation and transition issues  
- Z-index conflicts
- Content compression problems

### [🧠 State Issues](./state-issues.md)
- Context provider problems
- History navigation issues
- State synchronization problems
- Memory leaks and performance

### [📱 Mobile Issues](./mobile-issues.md)
- Touch interaction problems
- Viewport and sizing issues
- iOS-specific problems
- Android-specific problems

### [🌐 Browser Compatibility](./browser-compatibility.md)
- Safari-specific fixes
- Firefox compatibility
- Chrome/Edge issues
- Mobile browser problems

### [🚨 Emergency Fixes](./emergency-fixes.md)
- System reset procedures
- Debugging tools and techniques
- Development mode helpers
- Last resort solutions

## 🔧 Development Tools

### Built-in Debug Tools
```typescript
// Enable development logging (automatic in dev mode)
if (process.env.NODE_ENV === 'development') {
  // Detailed logging is automatically enabled
}

// Add panel demo buttons for testing
import PanelDemoButtons from '@modules/layout/components/panel-demo-buttons'

function DevTools() {
  return process.env.NODE_ENV === 'development' ? <PanelDemoButtons /> : null
}
```

### Browser DevTools Integration
1. **Console Logging**: Automatic state change logging in development
2. **React DevTools**: Panel state visible in component tree
3. **Performance Tab**: Monitor animation performance
4. **Network Tab**: Check for unnecessary re-renders

## 📞 Getting Help

### Before Asking for Help
1. ✅ Check this troubleshooting guide
2. ✅ Try the emergency fixes
3. ✅ Test with minimal reproduction case
4. ✅ Check browser console for errors
5. ✅ Verify system health check passes

### What to Include When Reporting Issues
- **Browser and version**
- **Device type and viewport size**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Console errors/warnings**
- **System health check output**

### Quick Support Resources
- **[API Reference](../companion-panel/api-reference.md)** - Method documentation
- **[Integration Guide](../integration/quick-start.md)** - Setup verification
- **[Examples](../integration/examples.md)** - Working code samples

---

## 🎯 **Problem Resolution Strategy**

1. **🔍 Identify**: Use the health check to narrow down the issue area
2. **📖 Research**: Check the relevant detailed troubleshooting guide
3. **🧪 Test**: Try the suggested solutions in isolation
4. **🔄 Verify**: Confirm the fix works across different scenarios
5. **📚 Learn**: Understand why the issue occurred to prevent recurrence

Most issues can be resolved quickly with the right diagnostic approach. The system is designed to be robust and self-healing when properly configured! 🚀