"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"

// Panel Types - Extensible for future features
export type PanelType = 'cart' | 'ai-assistant' | 'help' | 'filter'

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
  }
}

export interface UserChatContext {
  userId?: string
  sessionId: string
  recentProducts: string[]
  currentIntent: string
  sessionHistory: string[]
  preferences: Record<string, any>
  shoppingCart?: {
    items: any[]
    total: number
  }
  orderHistory?: string[]
}

export interface ChatSystemState {
  mainChat: {
    messages: ChatMessage[]
    context: UserChatContext
    sessionId: string
    lastActive: Date
    isTyping: boolean
  }
  tickets: {
    active: ChatTicket[]
    resolved: ChatTicket[]
    archived: ChatTicket[]
  }
  ui: {
    activeView: 'chat' | 'tickets'
    selectedTicket?: string
    isMinimized: boolean
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

  // Chat System State
  const [chatSystem, setChatSystem] = useState<ChatSystemState>(() => {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    return {
      mainChat: {
        messages: [
          {
            id: 'welcome-1',
            content: "Hi! I'm your AI shopping assistant. I can help you find products, track orders, and answer any questions about your shopping experience. What can I help you with today?",
            sender: 'ai',
            timestamp: new Date(),
            type: 'text'
          }
        ],
        context: {
          sessionId,
          recentProducts: [],
          currentIntent: 'welcome',
          sessionHistory: [],
          preferences: {}
        },
        sessionId,
        lastActive: new Date(),
        isTyping: false
      },
      tickets: {
        active: [],
        resolved: [],
        archived: []
      },
      ui: {
        activeView: 'chat',
        selectedTicket: undefined,
        isMinimized: false
      }
    }
  })

  // Handle responsive breakpoint detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768) // Tailwind md breakpoint
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  // Persist chat system state to localStorage
  useEffect(() => {
    const persistChatState = () => {
      try {
        localStorage.setItem('ai-companion-chat-state', JSON.stringify({
          mainChat: {
            ...chatSystem.mainChat,
            messages: chatSystem.mainChat.messages.slice(-50) // Keep last 50 messages
          },
          tickets: {
            active: chatSystem.tickets.active,
            resolved: chatSystem.tickets.resolved.slice(-10), // Keep last 10 resolved
            archived: chatSystem.tickets.archived.slice(-5) // Keep last 5 archived
          }
        }))
      } catch (error) {
        console.warn('Failed to persist chat state:', error)
      }
    }

    const timeoutId = setTimeout(persistChatState, 1000)
    return () => clearTimeout(timeoutId)
  }, [chatSystem])

  // Load persisted chat state on mount
  useEffect(() => {
    try {
      const persistedState = localStorage.getItem('ai-companion-chat-state')
      if (persistedState) {
        const parsed = JSON.parse(persistedState)
        setChatSystem(prev => ({
          ...prev,
          mainChat: {
            ...prev.mainChat,
            messages: parsed.mainChat?.messages || prev.mainChat.messages,
            context: { ...prev.mainChat.context, ...parsed.mainChat?.context }
          },
          tickets: {
            active: parsed.tickets?.active || [],
            resolved: parsed.tickets?.resolved || [],
            archived: parsed.tickets?.archived || []
          }
        }))
      }
    } catch (error) {
      console.warn('Failed to load persisted chat state:', error)
    }
  }, [])

  // Debug logging for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Companion Panel State:', {
        isOpen,
        currentPanel: currentPanel?.type,
        historyCount: panelHistory.length,
        chatView: chatSystem.ui.activeView,
        activeTickets: chatSystem.tickets.active.length,
        mainChatMessages: chatSystem.mainChat.messages.length
      })
    }
  }, [isOpen, currentPanel, panelHistory, chatSystem])

  // AI Response Simulation (replace with real AI integration)
  const simulateAIResponse = useCallback(async (message: string, context?: any): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    // Simple response logic (replace with actual AI)
    if (message.toLowerCase().includes('order')) {
      return "I can help you track your order! Could you please provide your order number?"
    } else if (message.toLowerCase().includes('product') || message.toLowerCase().includes('find')) {
      return "I'd be happy to help you find the perfect product! What are you looking for specifically?"
    } else if (message.toLowerCase().includes('return') || message.toLowerCase().includes('refund')) {
      return "I can assist you with returns and refunds. Let me check your order history and guide you through the process."
    } else {
      return "I understand your request. Let me help you with that. Is there anything specific you'd like to know more about?"
    }
  }, [])

  // Main Chat Actions
  const sendMainChatMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    }

    // Add user message
    setChatSystem(prev => ({
      ...prev,
      mainChat: {
        ...prev.mainChat,
        messages: [...prev.mainChat.messages, userMessage],
        lastActive: new Date(),
        isTyping: true
      }
    }))

    try {
      // Get AI response
      const aiResponse = await simulateAIResponse(content, chatSystem.mainChat.context)
      
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      }

      // Add AI response
      setChatSystem(prev => ({
        ...prev,
        mainChat: {
          ...prev.mainChat,
          messages: [...prev.mainChat.messages, aiMessage],
          isTyping: false
        }
      }))
    } catch (error) {
      console.error('Failed to get AI response:', error)
      setChatSystem(prev => ({
        ...prev,
        mainChat: {
          ...prev.mainChat,
          isTyping: false
        }
      }))
    }
  }, [chatSystem.mainChat.context, simulateAIResponse])

  const setMainChatTyping = useCallback((isTyping: boolean) => {
    setChatSystem(prev => ({
      ...prev,
      mainChat: {
        ...prev.mainChat,
        isTyping
      }
    }))
  }, [])

  const updateUserContext = useCallback((context: Partial<UserChatContext>) => {
    setChatSystem(prev => ({
      ...prev,
      mainChat: {
        ...prev.mainChat,
        context: {
          ...prev.mainChat.context,
          ...context
        }
      }
    }))
  }, [])

  // Ticket Actions
  const createTicket = useCallback((
    type: ChatTicket['type'], 
    title: string, 
    initialMessage?: string, 
    context?: any
  ): string => {
    const ticketId = `ticket-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const newTicket: ChatTicket = {
      id: ticketId,
      type,
      title,
      status: 'open',
      priority: 'medium',
      messages: initialMessage ? [{
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: initialMessage,
        sender: 'user',
        timestamp: new Date(),
        type: 'text'
      }] : [],
      createdAt: new Date(),
      tags: [],
      parentChatContext: chatSystem.mainChat.sessionId,
      aiContext: context
    }

    setChatSystem(prev => ({
      ...prev,
      tickets: {
        ...prev.tickets,
        active: [newTicket, ...prev.tickets.active]
      },
      ui: {
        ...prev.ui,
        activeView: 'tickets',
        selectedTicket: ticketId
      }
    }))

    return ticketId
  }, [chatSystem.mainChat.sessionId])

  const sendTicketMessage = useCallback(async (ticketId: string, content: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
      metadata: { ticketId }
    }

    // Add user message to ticket
    setChatSystem(prev => ({
      ...prev,
      tickets: {
        ...prev.tickets,
        active: prev.tickets.active.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, messages: [...ticket.messages, userMessage] }
            : ticket
        )
      }
    }))

    try {
      // Get AI response for ticket
      const aiResponse = await simulateAIResponse(content, { ticketId })
      
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        metadata: { ticketId }
      }

      // Add AI response to ticket
      setChatSystem(prev => ({
        ...prev,
        tickets: {
          ...prev.tickets,
          active: prev.tickets.active.map(ticket =>
            ticket.id === ticketId
              ? { ...ticket, messages: [...ticket.messages, aiMessage] }
              : ticket
          )
        }
      }))
    } catch (error) {
      console.error('Failed to get AI response for ticket:', error)
    }
  }, [simulateAIResponse])

  const resolveTicket = useCallback((ticketId: string, summary?: string) => {
    setChatSystem(prev => {
      const ticketToResolve = prev.tickets.active.find(t => t.id === ticketId)
      if (!ticketToResolve) return prev

      const resolvedTicket: ChatTicket = {
        ...ticketToResolve,
        status: 'resolved',
        resolvedAt: new Date(),
        summary
      }

      return {
        ...prev,
        tickets: {
          ...prev.tickets,
          active: prev.tickets.active.filter(t => t.id !== ticketId),
          resolved: [resolvedTicket, ...prev.tickets.resolved]
        },
        ui: {
          ...prev.ui,
          selectedTicket: prev.ui.selectedTicket === ticketId ? undefined : prev.ui.selectedTicket
        }
      }
    })
  }, [])

  const archiveTicket = useCallback((ticketId: string) => {
    setChatSystem(prev => {
      const ticketToArchive = [...prev.tickets.active, ...prev.tickets.resolved]
        .find(t => t.id === ticketId)
      
      if (!ticketToArchive) return prev

      const archivedTicket: ChatTicket = {
        ...ticketToArchive,
        status: 'archived'
      }

      return {
        ...prev,
        tickets: {
          active: prev.tickets.active.filter(t => t.id !== ticketId),
          resolved: prev.tickets.resolved.filter(t => t.id !== ticketId),
          archived: [archivedTicket, ...prev.tickets.archived]
        },
        ui: {
          ...prev.ui,
          selectedTicket: prev.ui.selectedTicket === ticketId ? undefined : prev.ui.selectedTicket
        }
      }
    })
  }, [])

  const updateTicketStatus = useCallback((ticketId: string, status: ChatTicket['status']) => {
    setChatSystem(prev => ({
      ...prev,
      tickets: {
        ...prev.tickets,
        active: prev.tickets.active.map(ticket =>
          ticket.id === ticketId ? { ...ticket, status } : ticket
        )
      }
    }))
  }, [])

  const updateTicketPriority = useCallback((ticketId: string, priority: ChatTicket['priority']) => {
    setChatSystem(prev => ({
      ...prev,
      tickets: {
        ...prev.tickets,
        active: prev.tickets.active.map(ticket =>
          ticket.id === ticketId ? { ...ticket, priority } : ticket
        )
      }
    }))
  }, [])

  // UI Actions
  const switchChatView = useCallback((view: 'chat' | 'tickets') => {
    setChatSystem(prev => ({
      ...prev,
      ui: {
        ...prev.ui,
        activeView: view
      }
    }))
  }, [])

  const selectTicket = useCallback((ticketId: string | null) => {
    setChatSystem(prev => ({
      ...prev,
      ui: {
        ...prev.ui,
        selectedTicket: ticketId || undefined
      }
    }))
  }, [])

  // Context Inheritance
  const createTicketFromChatMessage = useCallback((
    messageId: string, 
    ticketType: ChatTicket['type'], 
    title: string
  ): string => {
    const message = chatSystem.mainChat.messages.find(m => m.id === messageId)
    if (!message) return ''

    return createTicket(ticketType, title, message.content, {
      originalMessageId: messageId,
      inheritedContext: chatSystem.mainChat.context
    })
  }, [chatSystem.mainChat.messages, chatSystem.mainChat.context, createTicket])

  const inheritContextToTicket = useCallback((ticketId: string, contextKeys: string[]) => {
    const contextToInherit = contextKeys.reduce((acc, key) => {
      if (key in chatSystem.mainChat.context) {
        acc[key] = chatSystem.mainChat.context[key as keyof UserChatContext]
      }
      return acc
    }, {} as any)

    setChatSystem(prev => ({
      ...prev,
      tickets: {
        ...prev.tickets,
        active: prev.tickets.active.map(ticket =>
          ticket.id === ticketId
            ? { 
                ...ticket, 
                aiContext: { 
                  ...ticket.aiContext, 
                  inheritedContext: contextToInherit 
                } 
              }
            : ticket
        )
      }
    }))
  }, [chatSystem.mainChat.context])

  // Analytics
  const getChatAnalytics = useCallback(() => {
    const totalMessages = chatSystem.mainChat.messages.length + 
      [...chatSystem.tickets.active, ...chatSystem.tickets.resolved, ...chatSystem.tickets.archived]
        .reduce((acc, ticket) => acc + ticket.messages.length, 0)

    const resolvedTickets = chatSystem.tickets.resolved
    const averageResolutionTime = resolvedTickets.length > 0
      ? resolvedTickets.reduce((acc, ticket) => {
          if (ticket.resolvedAt) {
            return acc + (ticket.resolvedAt.getTime() - ticket.createdAt.getTime())
          }
          return acc
        }, 0) / resolvedTickets.length
      : 0

    const allTickets = [...chatSystem.tickets.active, ...chatSystem.tickets.resolved, ...chatSystem.tickets.archived]
    const commonTopics = allTickets
      .flatMap(ticket => ticket.tags)
      .reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1
        return acc
      }, {} as Record<string, number>)

    return {
      totalMessages,
      activeTickets: chatSystem.tickets.active.length,
      resolvedTickets: chatSystem.tickets.resolved.length,
      averageResolutionTime,
      commonTopics: Object.entries(commonTopics)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([topic]) => topic)
    }
  }, [chatSystem])

  // Existing panel management code...
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

    // Chat System
    chatSystem,
    
    // Main Chat Actions
    sendMainChatMessage,
    setMainChatTyping,
    updateUserContext,
    
    // Ticket Actions
    createTicket,
    sendTicketMessage,
    resolveTicket,
    archiveTicket,
    updateTicketStatus,
    updateTicketPriority,
    
    // UI Actions
    switchChatView,
    selectTicket,
    
    // Context Inheritance
    createTicketFromChatMessage,
    inheritContextToTicket,
    
    // Analytics
    getChatAnalytics
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