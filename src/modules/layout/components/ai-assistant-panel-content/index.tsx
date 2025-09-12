"use client"

import { useCompanionPanel } from "@lib/context/companion-panel-context"
import { MessageCircle, Sparkles, Ticket, Clock, CheckCircle, Archive, Plus, ArrowLeft, MoreVertical, X } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

// Types for the dual-layer chat system
interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  type?: 'text' | 'product-card' | 'order-update' | 'system'
}

interface ChatTicket {
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
  parentChatContext?: string // For context inheritance
  aiContext?: {
    inheritedContext: boolean
    // Add other AI context properties if needed
  }
}

interface UserContext {
  recentProducts: string[]
  currentIntent: string
  sessionHistory: string[]
  preferences: Record<string, any>
}

const AIAssistantPanelContent: React.FC = () => {
  const { 
    closePanel, 
    goBack,
    panelHistory,
    chatSystem, 
    sendMainChatMessage, 
    sendTicketMessage, 
    resolveTicket, 
    switchChatView, 
    selectTicket,
    createTicket
  } = useCompanionPanel()
  
  // Local UI state with persistence
  const [message, setMessage] = useState(() => {
    // Load persisted draft message on mount
    try {
      const persistedDraft = localStorage.getItem('ai-companion-draft-message')
      return persistedDraft || ""
    } catch (error) {
      console.warn('Failed to load persisted draft message:', error)
      return ""
    }
  })
  
  const handleSendMessage = async (content: string, ticketId?: string) => {
    if (!content.trim()) return

    if (ticketId) {
      await sendTicketMessage(ticketId, content)
    } else {
      await sendMainChatMessage(content)
    }

    // Clear both local state and persisted draft
    setMessage("")
    try {
      localStorage.removeItem('ai-companion-draft-message')
    } catch (error) {
      console.warn('Failed to clear persisted draft message:', error)
    }
  }

  // Persist draft message changes with debouncing
  const persistDraftMessage = useCallback((draftMessage: string) => {
    try {
      if (draftMessage.trim()) {
        localStorage.setItem('ai-companion-draft-message', draftMessage)
      } else {
        localStorage.removeItem('ai-companion-draft-message')
      }
    } catch (error) {
      console.warn('Failed to persist draft message:', error)
    }
  }, [])

  // Debounced persistence effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      persistDraftMessage(message)
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [message, persistDraftMessage])

  // Optional: Clear draft when component unmounts (panel closes)
  // Uncomment if you want to clear drafts when panel closes
  // useEffect(() => {
  //   return () => {
  //     try {
  //       localStorage.removeItem('ai-companion-draft-message')
  //     } catch (error) {
  //       console.warn('Failed to clear draft on unmount:', error)
  //     }
  //   }
  // }, [])

  const handleCreateTicket = (type: ChatTicket['type'], title: string, initialMessage?: string) => {
    const ticketId = createTicket(type, title, initialMessage)
    return ticketId
  }

  const getStatusIcon = (status: ChatTicket['status']) => {
    switch (status) {
      case 'open': return <Clock className="w-4 h-4 text-orange-500" />
      case 'in-progress': return <MessageCircle className="w-4 h-4 text-blue-500" />
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'archived': return <Archive className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: ChatTicket['priority']) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-700'
      case 'medium': return 'bg-blue-100 text-blue-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'urgent': return 'bg-red-100 text-red-700'
    }
  }

  const currentTicket = chatSystem.ui.selectedTicket ? 
    [...chatSystem.tickets.active, ...chatSystem.tickets.resolved]
      .find(t => t.id === chatSystem.ui.selectedTicket) : null
  
  const activeTickets = chatSystem.tickets.active
  const resolvedTickets = chatSystem.tickets.resolved

  return (
    <>
      {/* Header (compact, normalized) */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
          {/* Left side - Back button (only show if there's history) */}
          {panelHistory.length > 0 && (
            <button
              onClick={() => panelHistory.length > 0 ? goBack() : closePanel()}
              className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors mr-3"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          {/* Center - Title only */}
          <div className="flex items-center gap-2 flex-1">
            <h2 className="ty-title text-gray-900">AI Assistant</h2>
          </div>
          
          {/* Right side - Close button */}
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
            onClick={closePanel}
            data-testid="close-ai-button"
            title="Close AI Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      {/* Tab Navigation */}
        <div className="flex bg-white">
          <button
            onClick={() => switchChatView('chat')}
            className={`flex-1 px-3 py-2 text-sm font-medium text-center border-b-2 transition-colors ${
              chatSystem.ui.activeView === 'chat'
                ? 'border-purple-500 text-purple-600 bg-purple-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat
            </div>
          </button>
          <button
            onClick={() => switchChatView('tickets')}
            className={`flex-1 px-3 py-2 text-sm font-medium text-center border-b-2 transition-colors relative ${
              chatSystem.ui.activeView === 'tickets'
                ? 'border-purple-500 text-purple-600 bg-purple-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Ticket className="w-4 h-4" />
              Tickets
              {activeTickets.length > 0 && (
                <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-4">
                  {activeTickets.length}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {chatSystem.ui.activeView === 'chat' ? (
          /* Main Chat View */
          <>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatSystem.mainChat.messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} group`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 relative ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    
                    {/* Message Actions - only show for user messages */}
                    {msg.sender === 'user' && (
                      <div className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            const ticketId = handleCreateTicket(
                              'general-question',
                              `Follow-up: ${msg.content.slice(0, 50)}${msg.content.length > 50 ? '...' : ''}`,
                              msg.content
                            )
                          }}
                          className="p-1 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                          title="Create ticket from this message"
                        >
                          <Plus className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {chatSystem.mainChat.isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              {/* Context Indicator */}
              {chatSystem.mainChat.context.currentIntent !== 'welcome' && (
                <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <Sparkles className="w-4 h-4" />
                    <span>Context: {chatSystem.mainChat.context.currentIntent}</span>
                    {chatSystem.mainChat.context.recentProducts.length > 0 && (
                      <span className="text-blue-600">
                        • {chatSystem.mainChat.context.recentProducts.length} recent products
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(message)}
                />
                <button
                  onClick={() => handleSendMessage(message)}
                  disabled={!message.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  Send
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleCreateTicket('product-inquiry', 'Product inquiry', 'I need help finding a product')}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-xs font-medium transition-colors"
                >
                  🛍️ Find Product
                </button>
                <button
                  onClick={() => handleCreateTicket('order-support', 'Order support', 'I need help with my order')}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-xs font-medium transition-colors"
                >
                  📦 Order Help
                </button>
                <button
                  onClick={() => handleCreateTicket('technical-issue', 'Technical issue', 'I am experiencing a technical problem')}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-xs font-medium transition-colors"
                >
                  🔧 Tech Support
                </button>
              </div>
            </div>
          </>
        ) : chatSystem.ui.selectedTicket ? (
          /* Individual Ticket View */
          <>
            {/* Ticket Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => selectTicket(null)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to tickets
                </button>
                <div className="flex items-center gap-2">
                  {getStatusIcon(currentTicket!.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(currentTicket!.priority)}`}>
                    {currentTicket!.priority}
                  </span>
                  <button
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Ticket options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-medium text-gray-900">{currentTicket!.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Created {new Date(currentTicket!.createdAt).toLocaleDateString()}
                {currentTicket!.parentChatContext && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                    Inherited context
                  </span>
                )}
              </p>
              
              {/* Ticket Tags */}
              {currentTicket!.tags.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {currentTicket!.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Ticket Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Context Inheritance Indicator */}
              {currentTicket!.parentChatContext && currentTicket!.aiContext?.inheritedContext && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="p-1 bg-blue-100 rounded">
                      <Sparkles className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Inherited Context</p>
                      <p className="text-xs text-blue-700 mt-1">
                        This ticket has access to your main conversation context and preferences.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {currentTicket!.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Ticket Actions & Input */}
            <div className="p-4 border-t border-gray-200">
              {currentTicket!.status !== 'resolved' && (
                <>
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => resolveTicket(currentTicket!.id, 'Resolved by user')}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm font-medium"
                    >
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => {
                        // Switch back to main chat and inherit ticket context
                        switchChatView('chat')
                        // You could add logic here to inherit ticket context back to main chat
                      }}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium"
                    >
                      <MessageCircle className="w-4 h-4 inline mr-1" />
                      Continue in Chat
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Reply to this ticket..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(message, currentTicket!.id)}
                    />
                    <button
                      onClick={() => handleSendMessage(message, currentTicket!.id)}
                      disabled={!message.trim()}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      Send
                    </button>
                  </div>
                </>
              )}
              
              {/* Resolved ticket summary */}
              {currentTicket!.status === 'resolved' && currentTicket!.summary && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Ticket Resolved</p>
                      <p className="text-sm text-green-700 mt-1">{currentTicket!.summary}</p>
                      <p className="text-xs text-green-600 mt-2">
                        Resolved on {currentTicket!.resolvedAt ? new Date(currentTicket!.resolvedAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Tickets List View */
          <div className="flex-1 overflow-y-auto">
            {/* Active Tickets */}
            {activeTickets.length > 0 && (
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Active Tickets ({activeTickets.length})
                </h3>
                <div className="space-y-2">
                  {activeTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => selectTicket(ticket.id)}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(ticket.status)}
                          <span className="font-medium text-sm text-gray-900">{ticket.title}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {ticket.messages.length} messages • Created {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                      {ticket.tags.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {ticket.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resolved Tickets */}
            {resolvedTickets.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Resolved Tickets ({resolvedTickets.length})
                </h3>
                <div className="space-y-2">
                  {resolvedTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => selectTicket(ticket.id)}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors opacity-75"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(ticket.status)}
                          <span className="font-medium text-sm text-gray-900">{ticket.title}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Resolved {ticket.resolvedAt ? new Date(ticket.resolvedAt).toLocaleDateString() : 'Unknown'}
                        {ticket.summary && ` • ${ticket.summary}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {activeTickets.length === 0 && resolvedTickets.length === 0 && (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
                  <p className="text-gray-500 mb-4">
                    Tickets will appear here when you need focused help with specific topics.
                  </p>
                  <button
                    onClick={() => switchChatView('chat')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Start a conversation
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default AIAssistantPanelContent