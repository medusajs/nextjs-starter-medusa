# 🤖 Companion Menu System - Complete Build Guide

## Overview

This comprehensive guide covers how to build the revolutionary **Companion Panel System** - a modern approach to e-commerce interfaces that transforms traditional modal interruptions into a persistent, AI-driven workflow companion. The system provides seamless navigation between cart, AI assistant, help, filters, and other panels while maintaining context and enabling complex user workflows.

## 🏗️ System Architecture

### Core Components

```
├── Context & State Management
│   ├── CompanionPanelProvider (src/lib/context/companion-panel-context.tsx)
│   └── Panel State Management
├── Content-Aware Responsive System  
│   ├── useContentMediaQuery Hook (src/lib/hooks/use-content-media-query.ts)
│   ├── Tailwind Plugin (src/lib/tailwind/content-media-plugin.js)
│   └── Layout Wrappers
├── Panel Components
│   ├── ResizableCompanionPanel (main container)
│   ├── Individual Panel Content Components
│   └── Panel History & Navigation
└── Styling & CSS
    ├── Cart Drawer Styles (src/styles/modules/cart-drawer.css)
    ├── Resizable Panel Styles (src/styles/modules/resizable-panel.css)
    └── Tailwind Configuration
```

## 📚 Part 1: Content-Aware Responsive System

### 1.1 The Problem This Solves

Traditional responsive design responds to viewport width, but modern layouts with sidebars and companion panels compress content area. The content-aware system responds to **actual available content width** rather than viewport width.

**Traditional Problem:**
```html
<!-- ❌ Shows 4 columns even when sidebar compresses content -->
<div className="md:grid-cols-4">
```

**Our Solution:**
```html
<!-- ✅ Adapts to actual content space -->
<div className="cmd:grid-cols-4 panel-open-cmd:!grid-cols-2">
```

### 1.2 Content Media Query Hook

**File:** `src/lib/hooks/use-content-media-query.ts`

```typescript
import { useEffect, useRef, useState, useCallback } from 'react'

// Breakpoint definitions
export const BREAKPOINTS = {
  sm: 640,   // Small - mobile landscape, small tablets
  md: 768,   // Medium - tablets
  lg: 1024,  // Large - desktop
  xl: 1280,  // Extra large - wide desktop
} as const

export const SEMANTIC_BREAKPOINTS = {
  mobile: 640,    // Mobile devices
  tablet: 1024,   // Tablet devices  
  desktop: 1280,  // Desktop devices
} as const

export type BreakpointSize = keyof typeof BREAKPOINTS
export type SemanticSize = keyof typeof SEMANTIC_BREAKPOINTS

interface ContentMediaQuery {
  // Current measurements
  contentWidth: number
  
  // Size-based breakpoints (xs/sm/md/lg/xl)
  currentSize: BreakpointSize | 'xs'
  
  // Semantic breakpoints (mobile/tablet/desktop)  
  semanticSize: SemanticSize
  
  // Utilities
  isSize: (size: BreakpointSize | 'xs') => boolean
  isSemantic: (size: SemanticSize) => boolean
  isAtLeast: (size: BreakpointSize | 'xs') => boolean
  
  // Ref for the container element
  containerRef: React.RefObject<HTMLElement>
}

export const useContentMediaQuery = (): ContentMediaQuery => {
  const [contentWidth, setContentWidth] = useState(0)
  const [currentSize, setCurrentSize] = useState<BreakpointSize | 'xs'>('xs')
  const [semanticSize, setSemanticSize] = useState<SemanticSize>('mobile')
  const containerRef = useRef<HTMLElement>(null)

  // Calculate current breakpoint from width
  const calculateBreakpoint = useCallback((width: number): BreakpointSize | 'xs' => {
    if (width >= BREAKPOINTS.xl) return 'xl'
    if (width >= BREAKPOINTS.lg) return 'lg'
    if (width >= BREAKPOINTS.md) return 'md'
    if (width >= BREAKPOINTS.sm) return 'sm'
    return 'xs'
  }, [])

  // Calculate semantic size from width
  const calculateSemantic = useCallback((width: number): SemanticSize => {
    if (width >= SEMANTIC_BREAKPOINTS.desktop) return 'desktop'
    if (width >= SEMANTIC_BREAKPOINTS.tablet) return 'tablet'
    return 'mobile'
  }, [])

  // Set up ResizeObserver for content area measurement
  useEffect(() => {
    // Force immediate measurement
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const width = rect.width
      
      if (width > 0) {
        setContentWidth(width)
        setCurrentSize(calculateBreakpoint(width))
        setSemanticSize(calculateSemantic(width))
      }
    }

    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width
        setContentWidth(width)
        setCurrentSize(calculateBreakpoint(width))
        setSemanticSize(calculateSemantic(width))
      }
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [calculateBreakpoint, calculateSemantic])

  // Utility functions
  const isSize = useCallback((size: BreakpointSize | 'xs') => {
    return currentSize === size
  }, [currentSize])

  const isSemantic = useCallback((size: SemanticSize) => {
    return semanticSize === size
  }, [semanticSize])

  const isAtLeast = useCallback((size: BreakpointSize | 'xs') => {
    const sizes: (BreakpointSize | 'xs')[] = ['xs', 'sm', 'md', 'lg', 'xl']
    const currentIndex = sizes.indexOf(currentSize)
    const targetIndex = sizes.indexOf(size)
    return currentIndex >= targetIndex
  }, [currentSize])

  return {
    contentWidth,
    currentSize,
    semanticSize,
    isSize,
    isSemantic,
    isAtLeast,
    containerRef,
  }
}
```

### 1.3 Tailwind Content Media Plugin

**File:** `src/lib/tailwind/content-media-plugin.js`

```javascript
const plugin = require('tailwindcss/plugin')

/**
 * Content-Area Responsive Plugin for Tailwind CSS
 * 
 * Adds responsive variants based on content area width instead of viewport width.
 * Uses our custom data-media-query attribute system from useContentMediaQuery hook.
 * 
 * Usage Examples:
 * <div className="cxs:hidden csm:block cmd:p-4 clg:text-xl cxl:grid-cols-4">
 *   Content that responds to content area, not viewport!
 * </div>
 * 
 * <div className="panel-open-cmd:grid-cols-2 panel-closed:grid-cols-4">
 *   Grid changes when companion panel opens/closes
 * </div>
 */

const contentMediaPlugin = plugin(function({ addVariant }) {
  // =============================================================================
  // CONTENT-BASED BREAKPOINTS
  // Based on actual content area width (not viewport width)
  // =============================================================================
  
  // Content Extra Small (< 640px content width)
  addVariant('cxs', '[data-media-query="xs"] &')
  
  // Content Small (640px+ content width)  
  addVariant('csm', '[data-media-query="sm"] &')
  
  // Content Medium (768px+ content width)
  addVariant('cmd', '[data-media-query="md"] &')
  
  // Content Large (1024px+ content width)
  addVariant('clg', '[data-media-query="lg"] &')
  
  // Content Extra Large (1280px+ content width)
  addVariant('cxl', '[data-media-query="xl"] &')
  
  // =============================================================================
  // SEMANTIC SIZE VARIANTS
  // Human-readable breakpoints for better developer experience
  // =============================================================================
  
  addVariant('content-mobile', '[data-semantic-size="mobile"] &')
  addVariant('content-tablet', '[data-semantic-size="tablet"] &')  
  addVariant('content-desktop', '[data-semantic-size="desktop"] &')
  
  // =============================================================================
  // COMPANION PANEL STATE VARIANTS
  // Respond to panel open/closed state
  // =============================================================================
  
  addVariant('panel-open', '[data-panel-open="true"] &')
  addVariant('panel-closed', '[data-panel-open="false"] &')
  
  // =============================================================================
  // DEVICE AWARENESS VARIANTS
  // Distinguish between actual device vs content area compression
  // =============================================================================
  
  addVariant('device-mobile', '[data-device-mobile="true"] &')
  addVariant('device-desktop', '[data-device-mobile="false"] &')
  
  // =============================================================================
  // COMBINED VARIANTS
  // Advanced responsive behavior combining panel state + content size
  // =============================================================================
  
  // Panel open + content size combinations
  addVariant('panel-open-cxs', '[data-panel-open="true"][data-media-query="xs"] &')
  addVariant('panel-open-csm', '[data-panel-open="true"][data-media-query="sm"] &')
  addVariant('panel-open-cmd', '[data-panel-open="true"][data-media-query="md"] &')
  addVariant('panel-open-clg', '[data-panel-open="true"][data-media-query="lg"] &')
  addVariant('panel-open-cxl', '[data-panel-open="true"][data-media-query="xl"] &')
  
  // Panel closed + content size combinations
  addVariant('panel-closed-cxs', '[data-panel-open="false"][data-media-query="xs"] &')
  addVariant('panel-closed-csm', '[data-panel-open="false"][data-media-query="sm"] &')
  addVariant('panel-closed-cmd', '[data-panel-open="false"][data-media-query="md"] &')
  addVariant('panel-closed-clg', '[data-panel-open="false"][data-media-query="lg"] &')
  addVariant('panel-closed-cxl', '[data-panel-open="false"][data-media-query="xl"] &')
  
  // Device type + content size combinations
  addVariant('device-mobile-cxs', '[data-device-mobile="true"][data-media-query="xs"] &')
  addVariant('device-mobile-csm', '[data-device-mobile="true"][data-media-query="sm"] &')
  addVariant('device-desktop-cmd', '[data-device-mobile="false"][data-media-query="md"] &')
  addVariant('device-desktop-clg', '[data-device-mobile="false"][data-media-query="lg"] &')
  addVariant('device-desktop-cxl', '[data-device-mobile="false"][data-media-query="xl"] &')
})

module.exports = contentMediaPlugin
```

### 1.4 Tailwind Configuration Integration

**File:** `tailwind.config.js`

```javascript
const contentMediaPlugin = require("./src/lib/tailwind/content-media-plugin")

module.exports = {
  // ... other config
  plugins: [
    require("tailwindcss-radix")(),
    contentMediaPlugin, // Our custom content-area responsive plugin
  ],
}
```

### 1.5 Unified Layout Wrapper

**File:** `src/modules/layout/components/unified-layout-wrapper/index.tsx`

```tsx
"use client"

import React from 'react'
import { useCompanionPanel } from "@lib/context/companion-panel-context"
import { useContentMediaQuery } from '@lib/hooks/use-content-media-query'

interface UnifiedLayoutWrapperProps {
  children: React.ReactNode
  footer: React.ReactNode
  className?: string
}

/**
 * Unified Layout Wrapper that manages both content AND footer compression
 * with custom media query data attributes based on actual content area width
 */
const UnifiedLayoutWrapper: React.FC<UnifiedLayoutWrapperProps> = ({ 
  children, 
  footer,
  className = '' 
}) => {
  const { isOpen, isMobile, panelWidth } = useCompanionPanel()
  const { 
    currentSize, 
    semanticSize, 
    contentWidth, 
    containerRef,
    isAtLeast 
  } = useContentMediaQuery()

  // Update data attributes when size changes
  React.useEffect(() => {
    if (containerRef.current) {
      // Set size-based data attribute (xs/sm/md/lg/xl)
      containerRef.current.setAttribute('data-media-query', currentSize)
      
      // Set semantic data attribute (mobile/tablet/desktop)
      containerRef.current.setAttribute('data-semantic-size', semanticSize)
      
      // Set companion panel state for CSS
      containerRef.current.setAttribute('data-panel-open', isOpen.toString())
      containerRef.current.setAttribute('data-device-mobile', isMobile.toString())
      
      // Set actual width for advanced CSS (if needed)  
      containerRef.current.style.setProperty('--content-width', `${contentWidth}px`)
      containerRef.current.style.setProperty('--panel-width', `${panelWidth}px`)
    }
  }, [currentSize, semanticSize, isOpen, isMobile, contentWidth, isAtLeast, panelWidth])

  // On mobile, render normally (panels show as overlay)
  if (isMobile) {
    return (
      <div 
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className={`min-h-screen flex flex-col ${className}`}
        data-media-query={currentSize}
        data-semantic-size={semanticSize}
        data-panel-open={isOpen}
        data-device-mobile="true"
        style={{
          '--content-width': `${contentWidth}px`
        } as React.CSSProperties}
      >
        {/* Main content area */}
        <main className="flex-1">
          {children}
        </main>
        
        {/* Footer - full width on mobile */}
        <footer>
          {footer}
        </footer>
      </div>
    )
  }

  // On desktop/tablet, compress BOTH content AND footer when panel is open
  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${className}`}
      data-media-query={currentSize}
      data-semantic-size={semanticSize}
      data-panel-open={isOpen}
      data-device-mobile="false"
      style={{
        '--content-width': `${contentWidth}px`,
        '--panel-width': `${panelWidth}px`,
        marginRight: isOpen ? `${panelWidth}px` : '0px'
      } as React.CSSProperties}
    >
      {/* Main content area */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer - compressed with content on desktop */}
      <footer>
        {footer}
      </footer>
    </div>
  )
}

export default UnifiedLayoutWrapper
```

## 🎛️ Part 2: Companion Panel State Management

### 2.1 Core Context Provider

**File:** `src/lib/context/companion-panel-context.tsx`

This is the heart of the system. Key features:

- **Panel History Management**: Stack-based navigation with max 10 items
- **Chat System Integration**: AI assistant with tickets and context
- **Responsive Behavior**: Mobile overlay vs desktop companion
- **Keyboard Navigation**: ESC to close, Alt+← for back navigation
- **Real-time Sync**: External service integration for tickets

```typescript
"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"

// Dynamic Panel Types based on enabled features
export type PanelType = string // Will be constrained by configuration at runtime

// Chat system types
export interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  type?: 'text' | 'product-card' | 'order-update' | 'system'
  metadata?: {
    productId?: string
    orderId?: string
    ticketId?: string
    contextRef?: string
    tempId?: string // For temporary IDs during sync
    syncError?: string // For sync errors
    externalService?: string // For external service messages
    externalAuthor?: {
      type: 'customer' | 'agent'
      id: string
      name: string
    }
  }
}

export interface ChatTicket {
  id: string
  type: 'product-inquiry' | 'order-support' | 'general-question' | 'technical-issue'
  title: string
  status: 'open' | 'in-progress' | 'resolved' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  messages: ChatMessage[]
  createdAt: Date
  resolvedAt?: Date
  tags: string[]
  summary?: string
  parentChatContext?: string // Reference to main chat context
  aiContext?: {
    intent: string
    entities: Record<string, any>
    confidence: number
    inheritedContext?: Record<string, any> // For context inheritance
  }
  metadata?: {
    tempId?: string // For temporary IDs during sync
    syncError?: string // For sync errors
    lastSyncAt?: Date // For tracking last sync time
    externalAssignee?: {
      service: string
      assignee: {
        type: 'customer' | 'agent'
        id: string
        name: string
      }
    }
  }
}

// Panel State Interface
export interface PanelState {
  type: PanelType
  data?: any // Panel-specific data (cart items, product IDs, etc.)
  timestamp: number
  title: string
}

// Context Interface
interface CompanionPanelContextType {
  // Core State
  isOpen: boolean
  currentPanel: PanelState | null
  panelHistory: PanelState[]
  isMobile: boolean
  panelWidth: number // Current panel width in pixels
  
  // Panel Actions
  openPanel: (type: PanelType, data?: any, title?: string) => void
  closePanel: () => void
  goBack: () => void
  clearHistory: () => void
  setPanelWidth: (width: number) => void // Set current panel width
  
  // Navigation Info
  canGoBack: boolean
  historyCount: number
  
  // Legacy Cart API (for backward compatibility)
  openCartPanel: () => void
  closeCartPanel: () => void
  toggleCartPanel: () => void

  // Chat System State & Actions
  chatSystem: ChatSystemState
  
  // Main Chat Actions
  sendMainChatMessage: (content: string) => Promise<void>
  setMainChatTyping: (isTyping: boolean) => void
  updateUserContext: (context: Partial<UserChatContext>) => void
  
  // Ticket Actions
  createTicket: (type: ChatTicket['type'], title: string, initialMessage?: string, context?: any) => string
  sendTicketMessage: (ticketId: string, content: string) => Promise<void>
  resolveTicket: (ticketId: string, summary?: string) => void
  archiveTicket: (ticketId: string) => void
  updateTicketStatus: (ticketId: string, status: ChatTicket['status']) => void
  updateTicketPriority: (ticketId: string, priority: ChatTicket['priority']) => void
  
  // UI Actions
  switchChatView: (view: 'chat' | 'tickets') => void
  selectTicket: (ticketId: string | null) => void
  
  // Context Inheritance
  createTicketFromChatMessage: (messageId: string, ticketType: ChatTicket['type'], title: string) => string
  inheritContextToTicket: (ticketId: string, contextKeys: string[]) => void
  
  // Analytics & Insights
  getChatAnalytics: () => {
    totalMessages: number
    activeTickets: number
    resolvedTickets: number
    averageResolutionTime: number
    commonTopics: string[]
  }
}

const CompanionPanelContext = createContext<CompanionPanelContextType | undefined>(undefined)

export const useCompanionPanel = () => {
  const context = useContext(CompanionPanelContext)
  if (context === undefined) {
    throw new Error("useCompanionPanel must be used within a CompanionPanelProvider")
  }
  return context
}

// Simple panel configuration
const getPanelConfig = (): Record<string, { defaultTitle: string; icon?: string }> => {
  return {
    // Core features (always available)
    'cart': { defaultTitle: 'Shopping Cart', icon: '🛒' },
    'filter': { defaultTitle: 'Filters', icon: '🔍' },
    
    // Optional features
    'aiCompanion': { defaultTitle: 'AI Shopping Assistant', icon: '🤖' },
    'helpCompanion': { defaultTitle: 'Help & Support', icon: '❓' },
    'wishlist': { defaultTitle: 'Wishlist', icon: '❤️' },
    'productCompare': { defaultTitle: 'Compare Products', icon: '⚖️' },
    'reviews': { defaultTitle: 'Reviews', icon: '⭐' },
  }
}

export const CompanionPanelProvider: React.FC<CompanionPanelProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentPanel, setCurrentPanel] = useState<PanelState | null>(null)
  const [panelHistory, setPanelHistory] = useState<PanelState[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [panelWidth, setPanelWidth] = useState(400) // Default panel width

  // Handle responsive breakpoint detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768) // Tailwind md breakpoint
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  // Panel management functions
  const openPanel = useCallback((type: PanelType, data?: any, customTitle?: string) => {
    const panelConfig = getPanelConfig()
    const title = customTitle || panelConfig[type]?.defaultTitle || type
    
    const newPanel: PanelState = {
      type,
      data,
      timestamp: Date.now(),
      title,
    }

    // If opening the same panel type, just update data but don't add to history
    if (currentPanel?.type === type) {
      setCurrentPanel(newPanel)
      return
    }

    setPanelHistory(prev => {
      // If there's a current panel, add it to history (max 10 items)
      if (currentPanel) {
        const newHistory = [...prev, currentPanel]
        return newHistory.slice(-10) // Keep last 10 items
      }
      return prev
    })

    setCurrentPanel(newPanel)
    setIsOpen(true)
  }, [currentPanel])

  // Close panel completely
  const closePanel = useCallback(() => {
    setIsOpen(false)
    setCurrentPanel(null)
    setPanelHistory([])
  }, [])

  // Go back to previous panel in history
  const goBack = useCallback(() => {
    if (panelHistory.length === 0) {
      closePanel()
      return
    }

    const previousPanel = panelHistory[panelHistory.length - 1]
    const newHistory = panelHistory.slice(0, -1)

    setCurrentPanel(previousPanel)
    setPanelHistory(newHistory)
  }, [panelHistory, closePanel])

  // Clear history but keep current panel
  const clearHistory = useCallback(() => {
    setPanelHistory([])
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC to close or go back
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault()
        if (panelHistory.length > 0) {
          goBack()
        } else {
          closePanel()
        }
      }
      
      // Alt + Left Arrow to go back
      if (event.altKey && event.key === 'ArrowLeft' && panelHistory.length > 0) {
        event.preventDefault()
        goBack()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, panelHistory.length, goBack, closePanel])

  const value: CompanionPanelContextType = {
    // Core State
    isOpen,
    currentPanel,
    panelHistory,
    isMobile,
    panelWidth,
    
    // Panel Actions
    openPanel,
    closePanel,
    goBack,
    clearHistory,
    setPanelWidth,
    
    // Navigation Info
    canGoBack: panelHistory.length > 0,
    historyCount: panelHistory.length,
    
    // ... other chat system methods
  }

  return (
    <CompanionPanelContext.Provider value={value}>
      {children}
    </CompanionPanelContext.Provider>
  )
}

export { getPanelConfig }
```

### 2.2 History Management Features

The history system is a key differentiator:

1. **Stack-Based Navigation**: Each panel opening creates a history entry
2. **Smart Deduplication**: Same panel type updates data without history entry
3. **Automatic Cleanup**: Maximum 10 history items
4. **Keyboard Support**: ESC to close/back, Alt+← for history navigation
5. **Context Preservation**: Each history entry maintains panel data and state

**Key Implementation Details:**

```typescript
// History management in openPanel
setPanelHistory(prev => {
  // If there's a current panel, add it to history (max 10 items)
  if (currentPanel) {
    const newHistory = [...prev, currentPanel]
    return newHistory.slice(-10) // Keep last 10 items
  }
  return prev
})

// Back navigation
const goBack = useCallback(() => {
  if (panelHistory.length === 0) {
    closePanel()
    return
  }

  const previousPanel = panelHistory[panelHistory.length - 1]
  const newHistory = panelHistory.slice(0, -1)

  setCurrentPanel(previousPanel)
  setPanelHistory(newHistory)
}, [panelHistory, closePanel])
```

## 🎨 Part 3: Panel Components & Rendering

### 3.1 Main Panel Container

**File:** `src/modules/layout/components/resizable-companion-panel/index.tsx`

```tsx
"use client"

import React from "react"
import { useCompanionPanel } from "@lib/context/companion-panel-context"
import { usePanelResize } from "@lib/hooks/use-panel-resize"
import { HttpTypes } from "@medusajs/types"
import CartPanelContent from "../cart-panel-content"
import HelpPanelContent from "../help-panel-content"
import AIAssistantPanelContent from "../ai-assistant-panel-content"
import FilterPanelContent from "../filter-panel-content"

const PanelComponents = {
  'cart': CartPanelContent,
  'aiCompanion': AIAssistantPanelContent,
  'helpCompanion': HelpPanelContent,
  'filter': FilterPanelContent,
}

interface ResizableCompanionPanelProps {
  cart?: HttpTypes.StoreCart | null
}

const ResizableCompanionPanel: React.FC<ResizableCompanionPanelProps> = ({ cart }) => {
  const { isOpen, currentPanel, closePanel, isMobile, setPanelWidth } = useCompanionPanel()
  
  const {
    width,
    isResizing,
    handleMouseDown,
    resizerRef
  } = usePanelResize({
    minWidth: 350,
    maxWidthVw: 50,
    marginEm: 2,
    cookieKey: 'companion-panel-width',
    defaultWidth: 400,
    enabled: !isMobile && isOpen // Only enable on desktop when panel is open
  })

  // Sync panel width with context
  React.useEffect(() => {
    if (!isMobile && isOpen) {
      setPanelWidth(width)
    }
  }, [width, isMobile, isOpen, setPanelWidth])

  if (!isOpen || !currentPanel) {
    return null
  }

  const PanelComponent = PanelComponents[currentPanel.type]
  
  if (!PanelComponent) {
    return (
      <div 
        className="companion-panel companion-panel--open"
        style={{ width: isMobile ? undefined : width }}
      >
        <div className="companion-panel__container">
          <div className="p-4 text-center text-gray-500">
            Panel type "{currentPanel.type}" not implemented
          </div>
        </div>
      </div>
    )
  }

  const panelProps = {
    data: currentPanel.data,
    ...(currentPanel.type === 'cart' && { cart }),
  }

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className="companion-backdrop companion-backdrop--open"
        onClick={closePanel}
      />

      {/* Resizable Companion Panel */}
      <div 
        className={`
          companion-panel companion-panel--open
          ${isResizing ? 'select-none' : ''}
        `}
        style={{ 
          '--panel-width': isMobile ? undefined : `${width}px`,
          width: isMobile ? undefined : `${width}px`,
          transition: isResizing ? 'none' : 'transform 300ms ease-in-out'
        } as React.CSSProperties}
      >
        {/* Resize Handle - Only on desktop */}
        {!isMobile && (
          <div
            ref={resizerRef}
            className={`
              absolute left-0 top-0 bottom-0 w-1 cursor-col-resize 
              hover:bg-blue-400 active:bg-blue-500 transition-colors
              ${isResizing ? 'bg-blue-500' : 'bg-transparent hover:bg-blue-200'}
            `}
            onMouseDown={handleMouseDown}
            title="Drag to resize panel"
          >
            {/* Visual indicator */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gray-300 rounded-r opacity-50 hover:opacity-100 transition-opacity" />
          </div>
        )}

        <div className="companion-panel__container">
          <PanelComponent {...panelProps} />
        </div>
      </div>
    </>
  )
}

export default ResizableCompanionPanel
```

### 3.2 Panel Resize Hook

**File:** `src/lib/hooks/use-panel-resize.ts`

This hook provides smooth, responsive panel resizing with:

- **Cookie Persistence**: Remembers user's preferred width
- **Viewport Constraints**: Prevents panels from being too large
- **Smooth Dragging**: Disables transitions during resize
- **Touch Support**: Works on touch devices

### 3.3 Individual Panel Components

Each panel type has its own component:

- **CartPanelContent**: Shopping cart with items, quantities, checkout
- **AIAssistantPanelContent**: Chat interface with tickets and AI responses
- **HelpPanelContent**: Documentation and support resources
- **FilterPanelContent**: Product filtering for store pages

## 🎯 Part 4: CSS Styling System

### 4.1 Main Panel Styles

**File:** `src/styles/modules/cart-drawer.css`

The CSS system provides:

- **Mobile-First Design**: Overlay on mobile, sidebar on desktop
- **Smooth Animations**: 300ms transitions with easing
- **Content-Aware Responsive**: Uses our custom data attributes
- **High Specificity**: Ensures inline styles work for dynamic widths

Key CSS Classes:

```css
/* Companion panel - Unified container (mobile-first approach) */
.companion-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 100vw;
  max-width: 400px; /* Default for mobile */
  background-color: white;
  box-shadow: -10px 0 25px -3px rgba(0, 0, 0, 0.1), -4px 0 10px -2px rgba(0, 0, 0, 0.05);
  z-index: 76;
  transform: translateX(100%);
  transition: transform 300ms ease-in-out;
  pointer-events: none;
}

.companion-panel--open {
  transform: translateX(0);
  pointer-events: auto;
}

/* Desktop adjustments */
@media (min-width: 768px) {
  .companion-panel {
    top: 4rem; /* Account for navigation */
    height: calc(100vh - 4rem);
    width: 384px; /* Default width */
    max-width: none; /* Remove mobile constraint */
    box-shadow: -1px 0 0 0 rgba(229, 231, 235, 1); /* border-l border-gray-200 */
  }
  
  /* High specificity rule to ensure inline styles work */
  .companion-panel.companion-panel--open[style] {
    width: var(--panel-width, 384px) !important;
  }
}

/* Content-area responsive adjustments */
[data-media-query="md"] .companion-panel,
[data-media-query="lg"] .companion-panel,
[data-media-query="xl"] .companion-panel {
  top: 4rem;
  height: calc(100vh - 4rem);
  width: 384px; /* Default width */
  box-shadow: -1px 0 0 0 rgba(229, 231, 235, 1);
}
```

### 4.2 Resize Handle Styles

**File:** `src/styles/modules/resizable-panel.css`

```css
.resize-handle {
  position: absolute;
  left: -2px; /* Slightly outside panel for easier grabbing */
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  z-index: 10;
  background: transparent;
  transition: background-color 200ms ease;
}

.resize-handle:hover {
  background: rgba(59, 130, 246, 0.3); /* blue-500 with opacity */
}

.resize-handle:active,
.resize-handle.resizing {
  background: rgba(59, 130, 246, 0.6);
}

/* Disable transitions during resize for smooth dragging */
.resizing .companion-panel {
  transition: none !important;
}
```

## 🔧 Part 5: Integration & Setup

### 5.1 Layout Integration

**File:** `src/app/[countryCode]/(main)/layout.tsx`

```tsx
import { CompanionPanelProvider } from "@lib/context/companion-panel-context"
import ResizableCompanionPanel from "@modules/layout/components/resizable-companion-panel"
import UnifiedLayoutWrapper from "@modules/layout/components/unified-layout-wrapper"

export default async function PageLayout(props: { children: React.ReactNode }) {
  const cart = await retrieveCart()

  return (
    <CompanionPanelProvider>
      <Nav />
      
      <UnifiedLayoutWrapper 
        footer={<Footer />}
        className="debug-content-size"
      >
        {props.children}
      </UnifiedLayoutWrapper>
      
      <ResizableCompanionPanel cart={cart} />
    </CompanionPanelProvider>
  )
}
```

### 5.2 Usage Examples

#### Basic Panel Operations

```tsx
const { openPanel, closePanel, goBack, canGoBack } = useCompanionPanel()

// Open cart with data
openPanel('cart', { items: cartItems })

// Open AI assistant with context
openPanel('aiCompanion', { 
  context: 'product-recommendation',
  productId: 'abc123'
})

// Navigate back through history
if (canGoBack) {
  goBack()
}
```

#### Content-Aware Responsive Usage

```tsx
// Grid that adapts to content area width
<div className="
  cxs:grid-cols-1 
  csm:grid-cols-2 
  cmd:grid-cols-3 
  clg:grid-cols-4
  panel-open-cmd:!grid-cols-2
  panel-open-clg:!grid-cols-3
">
  {/* Grid items */}
</div>

// Typography that scales with content
<h1 className="
  cxs:text-xl 
  csm:text-2xl 
  cmd:text-3xl 
  panel-open:text-lg
">
  Responsive heading
</h1>
```

## 🚀 Part 6: Advanced Features

### 6.1 AI Chat System

The companion panel includes a sophisticated AI chat system with:

- **Main Chat**: General AI assistant conversation
- **Ticket System**: Structured support tickets with status tracking
- **Context Inheritance**: Chat context flows to tickets
- **Real-time Sync**: External service integration
- **Persistent State**: Chat history survives page reloads

### 6.2 Panel Types & Configuration

Available panel types:

- **cart**: Shopping cart functionality (always available)
- **filter**: Product filtering (contextual to store pages)
- **aiCompanion**: AI-powered shopping assistant
- **helpCompanion**: Contextual help system
- **productCompare**: Side-by-side product comparison
- **wishlist**: User wishlist management
- **reviews**: Product reviews and ratings

### 6.3 Keyboard Navigation

- **ESC**: Close panel or go back in history
- **Alt + ←**: Navigate back through history
- **Tab Navigation**: Full keyboard accessibility

### 6.4 Gesture Support Foundation

The system is designed with gesture support in mind:

- **Swipe Right**: Go back in history (mobile)
- **Swipe Left**: Close panel (mobile)
- **Pinch**: Resize panel (future feature)

## 🎯 Part 7: Best Practices

### 7.1 Content-Aware Responsive

1. **Start with viewport responsiveness** (`sm:`, `md:`, `lg:`) for basic design
2. **Add content responsiveness** (`csm:`, `cmd:`, `clg:`) for advanced adaptation
3. **Use panel state variants** for companion panel integration
4. **Test with panels open/closed** to ensure layouts work in all states
5. **Use `!` prefix for combined variants** to ensure proper CSS specificity

### 7.2 Panel Development

1. **Create focused panel components** - each panel should have a single responsibility
2. **Use the provided panel props pattern** - data, cart, etc.
3. **Implement proper loading states** - panels should handle async operations gracefully
4. **Add error boundaries** - panels should fail gracefully
5. **Consider mobile experience** - panels become overlays on mobile

### 7.3 Performance Considerations

1. **Lazy load panel content** - only load when panel is opened
2. **Debounce resize operations** - prevent excessive re-renders during resize
3. **Use React.memo for panel components** - prevent unnecessary re-renders
4. **Implement virtual scrolling** - for panels with large lists
5. **Clean up subscriptions** - remove event listeners when panels close

## 🔍 Part 8: Testing Strategy

### 8.1 Component Testing

Test each panel component in isolation:

```tsx
import { render, screen } from '@testing-library/react'
import { CompanionPanelProvider } from '@lib/context/companion-panel-context'
import CartPanelContent from '../cart-panel-content'

const renderWithProvider = (component) => {
  return render(
    <CompanionPanelProvider>
      {component}
    </CompanionPanelProvider>
  )
}

test('renders cart panel with items', () => {
  const mockCart = { items: [...] }
  renderWithProvider(<CartPanelContent cart={mockCart} />)
  expect(screen.getByText('Shopping Cart')).toBeInTheDocument()
})
```

### 8.2 Integration Testing

Test the complete panel workflow:

```tsx
test('panel history navigation works', async () => {
  const { openPanel, goBack, canGoBack } = renderHookWithProvider(() => useCompanionPanel())
  
  // Open first panel
  act(() => {
    openPanel('cart')
  })
  
  // Open second panel
  act(() => {
    openPanel('aiCompanion')
  })
  
  // Should be able to go back
  expect(canGoBack).toBe(true)
  
  // Go back to cart
  act(() => {
    goBack()
  })
  
  expect(currentPanel?.type).toBe('cart')
})
```

### 8.3 Responsive Testing

Test content-aware responsive behavior:

```tsx
test('content queries update on resize', () => {
  const { containerRef, currentSize } = renderHookWithProvider(() => useContentMediaQuery())
  
  // Mock ResizeObserver
  const mockObserver = jest.fn()
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: mockObserver,
    disconnect: jest.fn(),
  }))
  
  // Test size changes
  act(() => {
    // Simulate resize to 800px
    mockObserver.mock.calls[0][0]([{ contentRect: { width: 800 } }])
  })
  
  expect(currentSize).toBe('md')
})
```

## 📚 Part 9: Troubleshooting

### 9.1 Common Issues

**Panel not opening:**
- Check if CompanionPanelProvider wraps your component
- Verify panel type is registered in PanelComponents
- Check browser console for JavaScript errors

**Content queries not working:**
- Ensure UnifiedLayoutWrapper is used
- Check that data attributes are set on container
- Verify Tailwind plugin is loaded

**Resize not working:**
- Check if on mobile (resize disabled on mobile)
- Verify usePanelResize hook is properly configured
- Check CSS for conflicting styles

### 9.2 Performance Issues

**Slow panel opening:**
- Implement lazy loading for panel content
- Use React.memo for heavy components
- Check for unnecessary re-renders

**Jerky animations:**
- Disable transitions during resize
- Use transform instead of width changes where possible
- Check for conflicting CSS transitions

## 🎉 Conclusion

This Companion Menu System represents a significant advancement in e-commerce interface design. By combining content-aware responsive design, intelligent history navigation, AI integration, and smooth animations, it creates a truly modern shopping experience that adapts to user behavior and device capabilities.

The system is built with extensibility in mind - new panel types can be easily added, the responsive system works with any content, and the history navigation supports complex user workflows.

Key benefits:

- **Enhanced UX**: No more modal interruptions, persistent context
- **Content-Aware**: Responds to actual available space, not just viewport
- **AI-Driven**: Sophisticated chat system with ticket management
- **Mobile-Optimized**: Seamless experience across all devices
- **Developer-Friendly**: Clean APIs, extensive documentation, comprehensive testing

This system transforms the traditional e-commerce experience into something more akin to a desktop application - powerful, contextual, and intelligent.
