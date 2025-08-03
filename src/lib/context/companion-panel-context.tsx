"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"

// Panel Types - Extensible for future features
export type PanelType = 'cart' | 'ai-assistant' | 'help' | 'product-compare' | 'wishlist' | 'reviews'

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
}

const CompanionPanelContext = createContext<CompanionPanelContextType | undefined>(undefined)

export const useCompanionPanel = () => {
  const context = useContext(CompanionPanelContext)
  if (context === undefined) {
    throw new Error("useCompanionPanel must be used within a CompanionPanelProvider")
  }
  return context
}

// Backward compatibility alias
export const useCartPanel = useCompanionPanel

interface CompanionPanelProviderProps {
  children: React.ReactNode
}

// Panel configuration
const PANEL_CONFIG: Record<PanelType, { defaultTitle: string; icon?: string }> = {
  'cart': { defaultTitle: 'Shopping Cart', icon: '🛒' },
  'ai-assistant': { defaultTitle: 'AI Shopping Assistant', icon: '🤖' },
  'help': { defaultTitle: 'Help & Support', icon: '❓' },
  'product-compare': { defaultTitle: 'Compare Products', icon: '⚖️' },
  'wishlist': { defaultTitle: 'Wishlist', icon: '❤️' },
  'reviews': { defaultTitle: 'Reviews', icon: '⭐' },
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

  // Debug logging for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Companion Panel State:', {
        isOpen,
        currentPanel: currentPanel?.type,
        historyCount: panelHistory.length,
        history: panelHistory.map(p => p.type),
      })
    }
  }, [isOpen, currentPanel, panelHistory])

  // Open a panel (with history management)
  const openPanel = useCallback((type: PanelType, data?: any, customTitle?: string) => {
    const title = customTitle || PANEL_CONFIG[type]?.defaultTitle || type
    
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

  // Legacy cart methods (backward compatibility)
  const openCartPanel = useCallback(() => openPanel('cart'), [openPanel])
  const closeCartPanel = useCallback(() => closePanel(), [closePanel])
  const toggleCartPanel = useCallback(() => {
    if (isOpen && currentPanel?.type === 'cart') {
      closePanel()
    } else {
      openPanel('cart')
    }
  }, [isOpen, currentPanel, closePanel, openPanel])

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
    
    // Legacy Cart API
    openCartPanel,
    closeCartPanel,
    toggleCartPanel,
  }

  return (
    <CompanionPanelContext.Provider value={value}>
      {children}
    </CompanionPanelContext.Provider>
  )
}

// Backward compatibility alias
export const CartPanelProvider = CompanionPanelProvider

// Export panel configuration for use in components
export { PANEL_CONFIG }