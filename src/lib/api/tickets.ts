// API layer for ticket management with backend sync
import { ChatTicket, ChatMessage, UserChatContext } from '../context/companion-panel-context'

export interface TicketSyncStatus {
  id: string
  status: 'pending' | 'syncing' | 'synced' | 'error'
  lastSyncAt?: Date
  error?: string
}

export interface BackendTicket extends Omit<ChatTicket, 'messages'> {
  userId: string
  sessionId: string
  externalIds?: {
    intercom?: string
    zendesk?: string
    freshdesk?: string
  }
  metadata: {
    userAgent: string
    ipAddress?: string
    referrer?: string
    customerTier?: string
    accountValue?: number
  }
  assignedTo?: {
    adminId: string
    adminName: string
    adminEmail: string
  }
  internalNotes?: {
    id: string
    content: string
    authorId: string
    authorName: string
    createdAt: Date
    isPrivate: boolean
  }[]
  escalationLevel: 'none' | 'supervisor' | 'manager' | 'executive'
  slaStatus: {
    responseTime: number // minutes
    resolutionTime?: number // minutes
    breached: boolean
    dueAt: Date
  }
}

export interface BackendMessage extends ChatMessage {
  ticketId: string
  userId: string
  syncStatus: TicketSyncStatus
  externalIds?: {
    intercom?: string
    zendesk?: string
  }
}

export interface TicketFilters {
  status?: ChatTicket['status'][]
  priority?: ChatTicket['priority'][]
  type?: ChatTicket['type'][]
  assignedTo?: string[]
  createdAfter?: Date
  createdBefore?: Date
  tags?: string[]
  escalationLevel?: BackendTicket['escalationLevel'][]
  slaBreached?: boolean
}

export interface TicketAnalytics {
  totalTickets: number
  openTickets: number
  resolvedTickets: number
  averageResponseTime: number
  averageResolutionTime: number
  satisfactionScore: number
  escalationRate: number
  slaComplianceRate: number
  topCategories: { type: string; count: number }[]
  agentPerformance: {
    adminId: string
    adminName: string
    ticketsHandled: number
    averageResolutionTime: number
    satisfactionScore: number
  }[]
}

class TicketAPI {
  private baseUrl: string
  private apiKey: string
  private userId?: string
  private sessionId: string

  constructor(config: { baseUrl: string; apiKey: string; userId?: string; sessionId: string }) {
    this.baseUrl = config.baseUrl
    this.apiKey = config.apiKey
    this.userId = config.userId
    this.sessionId = config.sessionId
  }

  // Ticket CRUD Operations
  async createTicket(ticket: Omit<ChatTicket, 'id' | 'createdAt'>): Promise<BackendTicket> {
    const response = await fetch(`${this.baseUrl}/api/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-User-ID': this.userId || 'anonymous',
        'X-Session-ID': this.sessionId
      },
      body: JSON.stringify({
        ...ticket,
        userId: this.userId,
        sessionId: this.sessionId,
        metadata: {
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          timestamp: new Date().toISOString()
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to create ticket: ${response.statusText}`)
    }

    return response.json()
  }

  async updateTicket(ticketId: string, updates: Partial<ChatTicket>): Promise<BackendTicket> {
    const response = await fetch(`${this.baseUrl}/api/tickets/${ticketId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-User-ID': this.userId || 'anonymous'
      },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      throw new Error(`Failed to update ticket: ${response.statusText}`)
    }

    return response.json()
  }

  async getTicket(ticketId: string): Promise<BackendTicket> {
    const response = await fetch(`${this.baseUrl}/api/tickets/${ticketId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-User-ID': this.userId || 'anonymous'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to get ticket: ${response.statusText}`)
    }

    return response.json()
  }

  async getUserTickets(filters?: TicketFilters): Promise<BackendTicket[]> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()))
        } else if (value) {
          params.append(key, value.toString())
        }
      })
    }

    const response = await fetch(`${this.baseUrl}/api/tickets/user/${this.userId}?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-User-ID': this.userId || 'anonymous'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to get user tickets: ${response.statusText}`)
    }

    return response.json()
  }

  // Message Operations
  async addMessage(ticketId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<BackendMessage> {
    const response = await fetch(`${this.baseUrl}/api/tickets/${ticketId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-User-ID': this.userId || 'anonymous'
      },
      body: JSON.stringify({
        ...message,
        userId: this.userId,
        timestamp: new Date().toISOString()
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to add message: ${response.statusText}`)
    }

    return response.json()
  }

  async getMessages(ticketId: string): Promise<BackendMessage[]> {
    const response = await fetch(`${this.baseUrl}/api/tickets/${ticketId}/messages`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-User-ID': this.userId || 'anonymous'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to get messages: ${response.statusText}`)
    }

    return response.json()
  }

  // External Service Integration
  async syncToIntercom(ticketId: string): Promise<{ intercomId: string }> {
    const response = await fetch(`${this.baseUrl}/api/tickets/${ticketId}/sync/intercom`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-User-ID': this.userId || 'anonymous'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to sync to Intercom: ${response.statusText}`)
    }

    return response.json()
  }

  async syncToZendesk(ticketId: string): Promise<{ zendeskId: string }> {
    const response = await fetch(`${this.baseUrl}/api/tickets/${ticketId}/sync/zendesk`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-User-ID': this.userId || 'anonymous'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to sync to Zendesk: ${response.statusText}`)
    }

    return response.json()
  }

  // Real-time Updates
  subscribeToTicketUpdates(ticketId: string, callback: (update: Partial<BackendTicket>) => void): () => void {
    const eventSource = new EventSource(
      `${this.baseUrl}/api/tickets/${ticketId}/stream?auth=${this.apiKey}&userId=${this.userId}`
    )

    eventSource.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data)
        callback(update)
      } catch (error) {
        console.error('Failed to parse ticket update:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('Ticket update stream error:', error)
    }

    return () => eventSource.close()
  }

  // Analytics
  async getTicketAnalytics(filters?: TicketFilters): Promise<TicketAnalytics> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()))
        } else if (value) {
          params.append(key, value.toString())
        }
      })
    }

    const response = await fetch(`${this.baseUrl}/api/tickets/analytics?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-User-ID': this.userId || 'anonymous'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to get analytics: ${response.statusText}`)
    }

    return response.json()
  }

  // Bulk Operations
  async bulkUpdateTickets(ticketIds: string[], updates: Partial<ChatTicket>): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/tickets/bulk`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-User-ID': this.userId || 'anonymous'
      },
      body: JSON.stringify({ ticketIds, updates })
    })

    if (!response.ok) {
      throw new Error(`Failed to bulk update tickets: ${response.statusText}`)
    }
  }

  // Export
  async exportTickets(filters?: TicketFilters, format: 'csv' | 'json' | 'xlsx' = 'csv'): Promise<Blob> {
    const params = new URLSearchParams()
    params.append('format', format)
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()))
        } else if (value) {
          params.append(key, value.toString())
        }
      })
    }

    const response = await fetch(`${this.baseUrl}/api/tickets/export?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-User-ID': this.userId || 'anonymous'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to export tickets: ${response.statusText}`)
    }

    return response.blob()
  }
}

// Singleton instance
let ticketAPI: TicketAPI | null = null

export const initializeTicketAPI = (config: {
  baseUrl: string
  apiKey: string
  userId?: string
  sessionId: string
}) => {
  ticketAPI = new TicketAPI(config)
  return ticketAPI
}

export const getTicketAPI = (): TicketAPI => {
  if (!ticketAPI) {
    throw new Error('TicketAPI not initialized. Call initializeTicketAPI first.')
  }
  return ticketAPI
}

export default TicketAPI