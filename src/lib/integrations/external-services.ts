// External Service Integrations for Customer Support Systems
import { BackendTicket, BackendMessage } from '../api/tickets'
import { ChatTicket, ChatMessage } from '../context/companion-panel-context'

export interface ExternalServiceConfig {
  apiKey: string
  baseUrl?: string
  webhookSecret?: string
  customFields?: Record<string, any>
}

export interface ExternalTicket {
  id: string
  externalId: string
  service: 'intercom' | 'zendesk' | 'freshdesk' | 'helpscout' | 'crisp'
  status: string
  priority: string
  assigneeId?: string
  assigneeName?: string
  customerId?: string
  createdAt: Date
  updatedAt: Date
  tags: string[]
  metadata: Record<string, any>
}

export interface ExternalMessage {
  id: string
  externalId: string
  ticketId: string
  content: string
  author: {
    id: string
    name: string
    email?: string
    type: 'customer' | 'agent' | 'bot'
  }
  timestamp: Date
  attachments?: {
    id: string
    name: string
    url: string
    mimeType: string
    size: number
  }[]
}

export interface SyncResult {
  success: boolean
  externalId?: string
  error?: string
  metadata?: Record<string, any>
}

// Base class for external service integrations
abstract class ExternalServiceAdapter {
  protected config: ExternalServiceConfig
  protected serviceName: string

  constructor(serviceName: string, config: ExternalServiceConfig) {
    this.serviceName = serviceName
    this.config = config
  }

  abstract createTicket(ticket: BackendTicket): Promise<SyncResult>
  abstract updateTicket(externalId: string, updates: Partial<BackendTicket>): Promise<SyncResult>
  abstract addMessage(externalId: string, message: BackendMessage): Promise<SyncResult>
  abstract getTicket(externalId: string): Promise<ExternalTicket>
  abstract getMessages(externalId: string): Promise<ExternalMessage[]>
  abstract webhookHandler(payload: any, signature?: string): Promise<void>

  protected async makeRequest(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<Response> {
    const url = `${this.config.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        ...options.headers
      }
    })

    if (!response.ok) {
      throw new Error(`${this.serviceName} API error: ${response.statusText}`)
    }

    return response
  }

  protected validateWebhookSignature(payload: string, signature: string): boolean {
    // Implementation would vary by service
    return true
  }
}

// Intercom Integration
class IntercomAdapter extends ExternalServiceAdapter {
  constructor(config: ExternalServiceConfig) {
    super('Intercom', {
      baseUrl: 'https://api.intercom.io',
      ...config
    })
  }

  async createTicket(ticket: BackendTicket): Promise<SyncResult> {
    try {
      const intercomTicket = {
        type: 'conversation',
        subject: ticket.title,
        body: this.getTicketDescription(ticket),
        message_type: 'inapp',
        user: {
          user_id: ticket.userId,
          email: ticket.metadata.customerEmail || `user-${ticket.userId}@example.com`
        },
        custom_attributes: {
          ticket_id: ticket.id,
          priority: ticket.priority,
          tags: ticket.tags,
          escalation_level: ticket.escalationLevel,
          ...ticket.metadata
        }
      }

      const response = await this.makeRequest('/conversations', {
        method: 'POST',
        body: JSON.stringify(intercomTicket)
      })

      const result = await response.json()

      return {
        success: true,
        externalId: result.id,
        metadata: { intercom_url: `https://app.intercom.com/a/apps/${result.app_id}/inbox/conversation/${result.id}` }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async updateTicket(externalId: string, updates: Partial<BackendTicket>): Promise<SyncResult> {
    try {
      const intercomUpdates: any = {}

      if (updates.status) {
        intercomUpdates.state = this.mapStatusToIntercom(updates.status)
      }

      if (updates.assignedTo) {
        intercomUpdates.assignee = {
          type: 'admin',
          id: updates.assignedTo.adminId
        }
      }

      if (updates.tags) {
        intercomUpdates.tags = { add: updates.tags }
      }

      const response = await this.makeRequest(`/conversations/${externalId}`, {
        method: 'PUT',
        body: JSON.stringify(intercomUpdates)
      })

      return { success: true, externalId }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async addMessage(externalId: string, message: BackendMessage): Promise<SyncResult> {
    try {
      const intercomMessage = {
        type: 'user',
        body: message.content,
        message_type: 'comment'
      }

      const response = await this.makeRequest(`/conversations/${externalId}/reply`, {
        method: 'POST',
        body: JSON.stringify(intercomMessage)
      })

      const result = await response.json()

      return {
        success: true,
        externalId: result.id
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getTicket(externalId: string): Promise<ExternalTicket> {
    const response = await this.makeRequest(`/conversations/${externalId}`)
    const conversation = await response.json()

    return {
      id: conversation.id,
      externalId: conversation.id,
      service: 'intercom',
      status: conversation.state,
      priority: conversation.priority || 'medium',
      assigneeId: conversation.assignee?.id,
      assigneeName: conversation.assignee?.name,
      customerId: conversation.user?.id,
      createdAt: new Date(conversation.created_at * 1000),
      updatedAt: new Date(conversation.updated_at * 1000),
      tags: conversation.tags?.tags || [],
      metadata: conversation.custom_attributes || {}
    }
  }

  async getMessages(externalId: string): Promise<ExternalMessage[]> {
    const response = await this.makeRequest(`/conversations/${externalId}`)
    const conversation = await response.json()

    return conversation.conversation_parts.parts.map((part: any) => ({
      id: part.id,
      externalId: part.id,
      ticketId: externalId,
      content: part.body,
      author: {
        id: part.author.id,
        name: part.author.name,
        email: part.author.email,
        type: part.author.type === 'user' ? 'customer' : 'agent'
      },
      timestamp: new Date(part.created_at * 1000),
      attachments: part.attachments || []
    }))
  }

  async webhookHandler(payload: any, signature?: string): Promise<void> {
    if (signature && !this.validateWebhookSignature(JSON.stringify(payload), signature)) {
      throw new Error('Invalid webhook signature')
    }

    const { type, data } = payload

    switch (type) {
      case 'conversation.user.replied':
      case 'conversation.admin.replied':
        await this.handleMessageReceived(data.item)
        break
      case 'conversation.admin.assigned':
        await this.handleTicketAssigned(data.item)
        break
      case 'conversation.admin.closed':
        await this.handleTicketClosed(data.item)
        break
    }
  }

  private async handleMessageReceived(conversation: any): Promise<void> {
    const event = new CustomEvent('external-message-received', {
      detail: {
        service: 'intercom',
        ticketId: conversation.id,
        message: {
          content: conversation.conversation_parts.conversation_parts[0].body,
          author: conversation.conversation_parts.conversation_parts[0].author,
          timestamp: new Date(conversation.conversation_parts.conversation_parts[0].created_at * 1000)
        }
      }
    })
    window.dispatchEvent(event)
  }

  private async handleTicketAssigned(conversation: any): Promise<void> {
    const event = new CustomEvent('external-ticket-assigned', {
      detail: {
        service: 'intercom',
        ticketId: conversation.id,
        assignee: conversation.assignee
      }
    })
    window.dispatchEvent(event)
  }

  private async handleTicketClosed(conversation: any): Promise<void> {
    const event = new CustomEvent('external-ticket-closed', {
      detail: {
        service: 'intercom',
        ticketId: conversation.id,
        closedAt: new Date(conversation.updated_at * 1000)
      }
    })
    window.dispatchEvent(event)
  }

  private getTicketDescription(ticket: BackendTicket): string {
    let description = `Ticket created from AI Assistant chat\n\n`
    description += `Type: ${ticket.type}\n`
    description += `Priority: ${ticket.priority}\n`
    description += `Created: ${ticket.createdAt.toISOString()}\n\n`
    
    if (ticket.tags.length > 0) {
      description += `Tags: ${ticket.tags.join(', ')}\n\n`
    }

    return description
  }

  private mapStatusToIntercom(status: ChatTicket['status']): string {
    const statusMap = {
      'open': 'open',
      'in-progress': 'open',
      'resolved': 'closed',
      'archived': 'closed'
    }
    return statusMap[status] || 'open'
  }
}

// Zendesk Integration
class ZendeskAdapter extends ExternalServiceAdapter {
  constructor(config: ExternalServiceConfig) {
    super('Zendesk', {
      baseUrl: `https://${config.customFields?.subdomain}.zendesk.com/api/v2`,
      ...config
    })
  }

  async createTicket(ticket: BackendTicket): Promise<SyncResult> {
    try {
      const zendeskTicket = {
        ticket: {
          subject: ticket.title,
          comment: {
            body: this.getTicketDescription(ticket),
            author_id: ticket.userId
          },
          priority: this.mapPriorityToZendesk(ticket.priority),
          status: this.mapStatusToZendesk(ticket.status),
          type: this.mapTypeToZendesk(ticket.type),
          tags: ticket.tags,
          custom_fields: [
            { id: this.config.customFields?.ticketIdField, value: ticket.id },
            { id: this.config.customFields?.escalationField, value: ticket.escalationLevel }
          ].filter(field => field.id)
        }
      }

      const response = await this.makeRequest('/tickets.json', {
        method: 'POST',
        body: JSON.stringify(zendeskTicket)
      })

      const result = await response.json()

      return {
        success: true,
        externalId: result.ticket.id.toString(),
        metadata: { zendesk_url: result.ticket.url }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async updateTicket(externalId: string, updates: Partial<BackendTicket>): Promise<SyncResult> {
    try {
      const zendeskUpdates: any = { ticket: {} }

      if (updates.status) {
        zendeskUpdates.ticket.status = this.mapStatusToZendesk(updates.status)
      }

      if (updates.priority) {
        zendeskUpdates.ticket.priority = this.mapPriorityToZendesk(updates.priority)
      }

      if (updates.assignedTo) {
        zendeskUpdates.ticket.assignee_id = updates.assignedTo.adminId
      }

      if (updates.tags) {
        zendeskUpdates.ticket.tags = updates.tags
      }

      const response = await this.makeRequest(`/tickets/${externalId}.json`, {
        method: 'PUT',
        body: JSON.stringify(zendeskUpdates)
      })

      return { success: true, externalId }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async addMessage(externalId: string, message: BackendMessage): Promise<SyncResult> {
    try {
      const zendeskUpdate = {
        ticket: {
          comment: {
            body: message.content,
            author_id: message.userId,
            public: message.sender === 'user'
          }
        }
      }

      const response = await this.makeRequest(`/tickets/${externalId}.json`, {
        method: 'PUT',
        body: JSON.stringify(zendeskUpdate)
      })

      return { success: true, externalId }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getTicket(externalId: string): Promise<ExternalTicket> {
    const response = await this.makeRequest(`/tickets/${externalId}.json`)
    const data = await response.json()
    const ticket = data.ticket

    return {
      id: ticket.id.toString(),
      externalId: ticket.id.toString(),
      service: 'zendesk',
      status: ticket.status,
      priority: ticket.priority,
      assigneeId: ticket.assignee_id?.toString(),
      assigneeName: ticket.assignee?.name,
      customerId: ticket.requester_id.toString(),
      createdAt: new Date(ticket.created_at),
      updatedAt: new Date(ticket.updated_at),
      tags: ticket.tags || [],
      metadata: ticket.custom_fields?.reduce((acc: any, field: any) => {
        acc[field.id] = field.value
        return acc
      }, {}) || {}
    }
  }

  async getMessages(externalId: string): Promise<ExternalMessage[]> {
    const response = await this.makeRequest(`/tickets/${externalId}/comments.json`)
    const data = await response.json()

    return data.comments.map((comment: any) => ({
      id: comment.id.toString(),
      externalId: comment.id.toString(),
      ticketId: externalId,
      content: comment.body,
      author: {
        id: comment.author_id.toString(),
        name: comment.author?.name || 'Unknown',
        type: comment.public ? 'customer' : 'agent'
      },
      timestamp: new Date(comment.created_at),
      attachments: comment.attachments || []
    }))
  }

  async webhookHandler(payload: any, signature?: string): Promise<void> {
    // Zendesk webhook handling implementation
    const { type, ticket } = payload

    switch (type) {
      case 'ticket.created':
        await this.handleTicketCreated(ticket)
        break
      case 'ticket.updated':
        await this.handleTicketUpdated(ticket)
        break
      case 'comment.created':
        await this.handleCommentCreated(payload)
        break
    }
  }

  private async handleTicketCreated(ticket: any): Promise<void> {
    // Handle external ticket creation
  }

  private async handleTicketUpdated(ticket: any): Promise<void> {
    // Handle external ticket updates
  }

  private async handleCommentCreated(payload: any): Promise<void> {
    // Handle external comment creation
  }

  private getTicketDescription(ticket: BackendTicket): string {
    return `AI Assistant Ticket\n\nType: ${ticket.type}\nPriority: ${ticket.priority}\nTags: ${ticket.tags.join(', ')}`
  }

  private mapPriorityToZendesk(priority: ChatTicket['priority']): string {
    const priorityMap = {
      'low': 'low',
      'medium': 'normal',
      'high': 'high',
      'urgent': 'urgent'
    }
    return priorityMap[priority] || 'normal'
  }

  private mapStatusToZendesk(status: ChatTicket['status']): string {
    const statusMap = {
      'open': 'open',
      'in-progress': 'pending',
      'resolved': 'solved',
      'archived': 'closed'
    }
    return statusMap[status] || 'open'
  }

  private mapTypeToZendesk(type: ChatTicket['type']): string {
    const typeMap = {
      'product-inquiry': 'question',
      'order-support': 'incident',
      'technical-issue': 'problem',
      'general-question': 'question'
    }
    return typeMap[type] || 'question'
  }
}

// Service Factory
export class ExternalServiceManager {
  private adapters: Map<string, ExternalServiceAdapter> = new Map()

  addService(name: string, adapter: ExternalServiceAdapter): void {
    this.adapters.set(name, adapter)
  }

  getService(name: string): ExternalServiceAdapter | undefined {
    return this.adapters.get(name)
  }

  async syncTicketToAll(ticket: BackendTicket): Promise<Record<string, SyncResult>> {
    const results: Record<string, SyncResult> = {}

    for (const [name, adapter] of this.adapters) {
      try {
        results[name] = await adapter.createTicket(ticket)
      } catch (error) {
        results[name] = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    return results
  }

  async updateTicketInAll(externalIds: Record<string, string>, updates: Partial<BackendTicket>): Promise<Record<string, SyncResult>> {
    const results: Record<string, SyncResult> = {}

    for (const [serviceName, externalId] of Object.entries(externalIds)) {
      const adapter = this.adapters.get(serviceName)
      if (adapter) {
        try {
          results[serviceName] = await adapter.updateTicket(externalId, updates)
        } catch (error) {
          results[serviceName] = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      }
    }

    return results
  }
}

// Factory functions
export const createIntercomAdapter = (config: ExternalServiceConfig): IntercomAdapter => {
  return new IntercomAdapter(config)
}

export const createZendeskAdapter = (config: ExternalServiceConfig): ZendeskAdapter => {
  return new ZendeskAdapter(config)
}

// Singleton manager
let serviceManager: ExternalServiceManager | null = null

export const initializeExternalServices = (configs: Record<string, ExternalServiceConfig>): ExternalServiceManager => {
  serviceManager = new ExternalServiceManager()

  for (const [serviceName, config] of Object.entries(configs)) {
    switch (serviceName.toLowerCase()) {
      case 'intercom':
        serviceManager.addService('intercom', createIntercomAdapter(config))
        break
      case 'zendesk':
        serviceManager.addService('zendesk', createZendeskAdapter(config))
        break
      // Add more services as needed
    }
  }

  return serviceManager
}

export const getExternalServiceManager = (): ExternalServiceManager => {
  if (!serviceManager) {
    throw new Error('ExternalServiceManager not initialized. Call initializeExternalServices first.')
  }
  return serviceManager
}

export default ExternalServiceManager