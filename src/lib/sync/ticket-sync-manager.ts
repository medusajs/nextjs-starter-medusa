// Ticket Sync Manager - Handles offline/online sync, conflict resolution, and real-time updates
import { ChatTicket, ChatMessage } from '../context/companion-panel-context'
import { getTicketAPI, BackendTicket, BackendMessage, TicketSyncStatus } from '../api/tickets'

export interface SyncQueueItem {
  id: string
  type: 'create_ticket' | 'update_ticket' | 'add_message' | 'resolve_ticket' | 'archive_ticket'
  payload: any
  timestamp: Date
  retryCount: number
  maxRetries: number
}

export interface ConflictResolution {
  strategy: 'client_wins' | 'server_wins' | 'merge' | 'manual'
  resolvedData?: any
}

export interface SyncManagerConfig {
  maxRetries: number
  retryDelay: number
  batchSize: number
  syncInterval: number
  conflictResolution: ConflictResolution['strategy']
  enableRealTime: boolean
}

class TicketSyncManager {
  private config: SyncManagerConfig
  private syncQueue: SyncQueueItem[] = []
  private isOnline: boolean = navigator.onLine
  private isSyncing: boolean = false
  private syncInterval?: NodeJS.Timeout
  private eventSubscriptions: Map<string, () => void> = new Map()
  private syncStatusCallbacks: ((status: TicketSyncStatus) => void)[] = []

  constructor(config: Partial<SyncManagerConfig> = {}) {
    this.config = {
      maxRetries: 3,
      retryDelay: 1000,
      batchSize: 10,
      syncInterval: 30000, // 30 seconds
      conflictResolution: 'server_wins',
      enableRealTime: true,
      ...config
    }

    this.initializeEventListeners()
    this.startPeriodicSync()
  }

  private initializeEventListeners() {
    // Network status monitoring
    window.addEventListener('online', () => {
      console.log('🌐 Network online - resuming sync')
      this.isOnline = true
      this.processSyncQueue()
    })

    window.addEventListener('offline', () => {
      console.log('📴 Network offline - queuing operations')
      this.isOnline = false
    })

    // Page visibility for background sync
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        this.processSyncQueue()
      }
    })

    // Before unload - attempt to sync critical items
    window.addEventListener('beforeunload', () => {
      const criticalItems = this.syncQueue.filter(item => 
        item.type === 'create_ticket' || item.type === 'add_message'
      )
      if (criticalItems.length > 0) {
        // Use sendBeacon for critical sync items
        this.sendBeaconSync(criticalItems)
      }
    })
  }

  private startPeriodicSync() {
    this.syncInterval = setInterval(() => {
      if (this.isOnline && !this.isSyncing) {
        this.processSyncQueue()
      }
    }, this.config.syncInterval)
  }

  private async sendBeaconSync(items: SyncQueueItem[]) {
    try {
      const api = getTicketAPI()
      const payload = JSON.stringify({ items })
      navigator.sendBeacon(`${api['baseUrl']}/api/tickets/sync/beacon`, payload)
    } catch (error) {
      console.error('Beacon sync failed:', error)
    }
  }

  // Queue operations for sync
  async queueTicketCreate(ticket: Omit<ChatTicket, 'id' | 'createdAt'>): Promise<string> {
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const queueItem: SyncQueueItem = {
      id: tempId,
      type: 'create_ticket',
      payload: { ...ticket, tempId },
      timestamp: new Date(),
      retryCount: 0,
      maxRetries: this.config.maxRetries
    }

    this.syncQueue.push(queueItem)
    this.notifySyncStatus({ id: tempId, status: 'pending' })

    if (this.isOnline) {
      this.processSyncQueue()
    }

    return tempId
  }

  async queueTicketUpdate(ticketId: string, updates: Partial<ChatTicket>): Promise<void> {
    const queueItem: SyncQueueItem = {
      id: `update-${ticketId}-${Date.now()}`,
      type: 'update_ticket',
      payload: { ticketId, updates },
      timestamp: new Date(),
      retryCount: 0,
      maxRetries: this.config.maxRetries
    }

    this.syncQueue.push(queueItem)
    this.notifySyncStatus({ id: ticketId, status: 'pending' })

    if (this.isOnline) {
      this.processSyncQueue()
    }
  }

  async queueMessageAdd(ticketId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<string> {
    const tempId = `temp-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const queueItem: SyncQueueItem = {
      id: tempId,
      type: 'add_message',
      payload: { ticketId, message: { ...message, tempId } },
      timestamp: new Date(),
      retryCount: 0,
      maxRetries: this.config.maxRetries
    }

    this.syncQueue.push(queueItem)
    this.notifySyncStatus({ id: tempId, status: 'pending' })

    if (this.isOnline) {
      this.processSyncQueue()
    }

    return tempId
  }

  // Process sync queue
  private async processSyncQueue(): Promise<void> {
    if (this.isSyncing || !this.isOnline || this.syncQueue.length === 0) {
      return
    }

    this.isSyncing = true
    console.log(`🔄 Processing sync queue: ${this.syncQueue.length} items`)

    try {
      const batch = this.syncQueue.splice(0, this.config.batchSize)
      await this.processBatch(batch)
    } catch (error) {
      console.error('Sync batch processing failed:', error)
    } finally {
      this.isSyncing = false
    }

    // Continue processing if there are more items
    if (this.syncQueue.length > 0) {
      setTimeout(() => this.processSyncQueue(), 100)
    }
  }

  private async processBatch(batch: SyncQueueItem[]): Promise<void> {
    const api = getTicketAPI()
    
    for (const item of batch) {
      try {
        this.notifySyncStatus({ id: item.id, status: 'syncing' })

        switch (item.type) {
          case 'create_ticket':
            await this.syncCreateTicket(item)
            break
          case 'update_ticket':
            await this.syncUpdateTicket(item)
            break
          case 'add_message':
            await this.syncAddMessage(item)
            break
          case 'resolve_ticket':
            await this.syncResolveTicket(item)
            break
          case 'archive_ticket':
            await this.syncArchiveTicket(item)
            break
        }

        this.notifySyncStatus({ 
          id: item.id, 
          status: 'synced', 
          lastSyncAt: new Date() 
        })

      } catch (error) {
        console.error(`Sync failed for item ${item.id}:`, error)
        await this.handleSyncError(item, error)
      }
    }
  }

  private async syncCreateTicket(item: SyncQueueItem): Promise<void> {
    const api = getTicketAPI()
    const { tempId, ...ticketData } = item.payload
    
    try {
      const backendTicket = await api.createTicket(ticketData)
      
      // Update local storage with real ID
      this.updateLocalTicketId(tempId, backendTicket.id)
      
      // Subscribe to real-time updates for this ticket
      if (this.config.enableRealTime) {
        this.subscribeToTicketUpdates(backendTicket.id)
      }
      
    } catch (error) {
      throw new Error(`Failed to create ticket: ${error}`)
    }
  }

  private async syncUpdateTicket(item: SyncQueueItem): Promise<void> {
    const api = getTicketAPI()
    const { ticketId, updates } = item.payload
    
    try {
      // Check for conflicts by getting latest version
      const latestTicket = await api.getTicket(ticketId)
      const localTicket = this.getLocalTicket(ticketId)
      
      if (localTicket && this.hasConflict(localTicket, latestTicket)) {
        const resolved = await this.resolveConflict(localTicket, latestTicket, updates)
        await api.updateTicket(ticketId, resolved)
      } else {
        await api.updateTicket(ticketId, updates)
      }
      
    } catch (error) {
      throw new Error(`Failed to update ticket: ${error}`)
    }
  }

  private async syncAddMessage(item: SyncQueueItem): Promise<void> {
    const api = getTicketAPI()
    const { ticketId, message } = item.payload
    
    try {
      const backendMessage = await api.addMessage(ticketId, message)
      
      // Update local storage with real message ID
      this.updateLocalMessageId(message.tempId, backendMessage.id)
      
    } catch (error) {
      throw new Error(`Failed to add message: ${error}`)
    }
  }

  private async syncResolveTicket(item: SyncQueueItem): Promise<void> {
    const api = getTicketAPI()
    const { ticketId, summary } = item.payload
    
    await api.updateTicket(ticketId, { 
      status: 'resolved', 
      resolvedAt: new Date(),
      summary 
    })
  }

  private async syncArchiveTicket(item: SyncQueueItem): Promise<void> {
    const api = getTicketAPI()
    const { ticketId } = item.payload
    
    await api.updateTicket(ticketId, { status: 'archived' })
  }

  // Conflict resolution
  private hasConflict(localTicket: ChatTicket, serverTicket: BackendTicket): boolean {
    // Simple conflict detection - check if server version is newer
    const localUpdated = new Date(localTicket.createdAt).getTime()
    const serverUpdated = new Date(serverTicket.createdAt).getTime()
    
    return serverUpdated > localUpdated
  }

  private async resolveConflict(
    localTicket: ChatTicket, 
    serverTicket: BackendTicket, 
    pendingUpdates: Partial<ChatTicket>
  ): Promise<Partial<ChatTicket>> {
    switch (this.config.conflictResolution) {
      case 'client_wins':
        return pendingUpdates
      
      case 'server_wins':
        return {}
      
      case 'merge':
        return {
          ...serverTicket,
          ...pendingUpdates,
          // Merge arrays
          tags: [...new Set([...(serverTicket.tags || []), ...(pendingUpdates.tags || [])])],
          // Keep latest timestamp
          createdAt: new Date(Math.max(
            new Date(serverTicket.createdAt).getTime(),
            new Date(localTicket.createdAt).getTime()
          ))
        }
      
      case 'manual':
        // Emit conflict event for manual resolution
        this.emitConflictEvent(localTicket, serverTicket, pendingUpdates)
        return pendingUpdates // Default to client for now
      
      default:
        return pendingUpdates
    }
  }

  private emitConflictEvent(
    localTicket: ChatTicket, 
    serverTicket: BackendTicket, 
    pendingUpdates: Partial<ChatTicket>
  ) {
    const event = new CustomEvent('ticket-conflict', {
      detail: { localTicket, serverTicket, pendingUpdates }
    })
    window.dispatchEvent(event)
  }

  // Error handling
  private async handleSyncError(item: SyncQueueItem, error: any): Promise<void> {
    item.retryCount++
    
    if (item.retryCount <= item.maxRetries) {
      // Exponential backoff
      const delay = this.config.retryDelay * Math.pow(2, item.retryCount - 1)
      
      setTimeout(() => {
        this.syncQueue.unshift(item) // Add back to front of queue
        this.processSyncQueue()
      }, delay)
      
      this.notifySyncStatus({ 
        id: item.id, 
        status: 'pending',
        error: `Retry ${item.retryCount}/${item.maxRetries}: ${error.message}`
      })
    } else {
      this.notifySyncStatus({ 
        id: item.id, 
        status: 'error',
        error: `Max retries exceeded: ${error.message}`
      })
      
      // Store failed item for manual retry
      this.storeFailedSync(item, error)
    }
  }

  private storeFailedSync(item: SyncQueueItem, error: any): void {
    try {
      const failedSyncs = JSON.parse(localStorage.getItem('failed-ticket-syncs') || '[]')
      failedSyncs.push({ item, error: error.message, timestamp: new Date() })
      localStorage.setItem('failed-ticket-syncs', JSON.stringify(failedSyncs))
    } catch (e) {
      console.error('Failed to store failed sync:', e)
    }
  }

  // Real-time updates
  private subscribeToTicketUpdates(ticketId: string): void {
    if (this.eventSubscriptions.has(ticketId)) {
      return // Already subscribed
    }

    const api = getTicketAPI()
    const unsubscribe = api.subscribeToTicketUpdates(ticketId, (update) => {
      this.handleRealtimeUpdate(ticketId, update)
    })

    this.eventSubscriptions.set(ticketId, unsubscribe)
  }

  private handleRealtimeUpdate(ticketId: string, update: Partial<BackendTicket>): void {
    // Emit event for UI to handle
    const event = new CustomEvent('ticket-realtime-update', {
      detail: { ticketId, update }
    })
    window.dispatchEvent(event)
  }

  // Status notifications
  private notifySyncStatus(status: TicketSyncStatus): void {
    this.syncStatusCallbacks.forEach(callback => callback(status))
  }

  public onSyncStatusChange(callback: (status: TicketSyncStatus) => void): () => void {
    this.syncStatusCallbacks.push(callback)
    return () => {
      const index = this.syncStatusCallbacks.indexOf(callback)
      if (index > -1) {
        this.syncStatusCallbacks.splice(index, 1)
      }
    }
  }

  // Utility methods
  private updateLocalTicketId(tempId: string, realId: string): void {
    // Implementation would update local storage/context
    const event = new CustomEvent('ticket-id-updated', {
      detail: { tempId, realId }
    })
    window.dispatchEvent(event)
  }

  private updateLocalMessageId(tempId: string, realId: string): void {
    const event = new CustomEvent('message-id-updated', {
      detail: { tempId, realId }
    })
    window.dispatchEvent(event)
  }

  private getLocalTicket(ticketId: string): ChatTicket | null {
    // Implementation would get from local storage/context
    try {
      const chatState = JSON.parse(localStorage.getItem('ai-companion-chat-state') || '{}')
      const allTickets = [
        ...(chatState.tickets?.active || []),
        ...(chatState.tickets?.resolved || []),
        ...(chatState.tickets?.archived || [])
      ]
      return allTickets.find((t: ChatTicket) => t.id === ticketId) || null
    } catch {
      return null
    }
  }

  // Public methods
  public getQueueStatus(): { pending: number; syncing: number; failed: number } {
    const failedSyncs = JSON.parse(localStorage.getItem('failed-ticket-syncs') || '[]')
    return {
      pending: this.syncQueue.length,
      syncing: this.isSyncing ? 1 : 0,
      failed: failedSyncs.length
    }
  }

  public async retryFailedSyncs(): Promise<void> {
    try {
      const failedSyncs = JSON.parse(localStorage.getItem('failed-ticket-syncs') || '[]')
      
      for (const failed of failedSyncs) {
        failed.item.retryCount = 0 // Reset retry count
        this.syncQueue.push(failed.item)
      }
      
      localStorage.removeItem('failed-ticket-syncs')
      
      if (this.isOnline) {
        this.processSyncQueue()
      }
    } catch (error) {
      console.error('Failed to retry failed syncs:', error)
    }
  }

  public async forceSyncTicket(ticketId: string): Promise<void> {
    const api = getTicketAPI()
    
    try {
      // Get latest from server
      const serverTicket = await api.getTicket(ticketId)
      
      // Emit event for UI to update
      const event = new CustomEvent('ticket-force-synced', {
        detail: { ticketId, serverTicket }
      })
      window.dispatchEvent(event)
      
    } catch (error) {
      console.error(`Force sync failed for ticket ${ticketId}:`, error)
      throw error
    }
  }

  public destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }
    
    // Unsubscribe from all real-time updates
    this.eventSubscriptions.forEach(unsubscribe => unsubscribe())
    this.eventSubscriptions.clear()
    
    // Clear callbacks
    this.syncStatusCallbacks = []
  }
}

// Singleton instance
let syncManager: TicketSyncManager | null = null

export const initializeSyncManager = (config?: Partial<SyncManagerConfig>) => {
  syncManager = new TicketSyncManager(config)
  return syncManager
}

export const getSyncManager = (): TicketSyncManager => {
  if (!syncManager) {
    throw new Error('SyncManager not initialized. Call initializeSyncManager first.')
  }
  return syncManager
}

export default TicketSyncManager