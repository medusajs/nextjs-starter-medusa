/**
 * Standardized Panel Type Definitions
 * 
 * This file provides consistent type definitions for the companion panel system.
 * All panel-related code should use these types to ensure consistency.
 */

/**
 * Panel Types Enum
 * 
 * Defines all available panel types in the companion panel system.
 * Use this enum instead of string literals for better type safety and refactoring support.
 */
export enum PanelType {
  CART = 'cart',
  AI_ASSISTANT = 'ai-assistant',
  HELP = 'help',
  PRODUCT_COMPARE = 'product-compare',
  WISHLIST = 'wishlist',
  REVIEWS = 'reviews',
  FILTER = 'filter'
}

/**
 * Panel Type Union (for backward compatibility)
 * 
 * Use PanelType enum instead when possible
 */
export type PanelTypeString = 
  | 'cart'
  | 'ai-assistant'
  | 'help'
  | 'product-compare'
  | 'wishlist'
  | 'reviews'
  | 'filter'

/**
 * Panel State Interface
 * 
 * Represents the state of an individual panel in the system
 */
export interface PanelState {
  /** Panel type identifier */
  type: PanelType | PanelTypeString
  /** Panel-specific data payload */
  data?: any
  /** Creation timestamp for history tracking */
  timestamp: number
  /** Display title for the panel */
  title: string
}

/**
 * Panel Configuration Interface
 * 
 * Configuration options for individual panel types
 */
export interface PanelConfig {
  /** Default title for the panel type */
  defaultTitle: string
  /** Icon representation (emoji or icon name) */
  icon: string
  /** Display priority (higher = more prominent) */
  priority: number
  /** Whether this panel type is enabled */
  enabled: boolean
}

/**
 * Panel Registry Interface
 * 
 * Maps panel types to their configuration
 */
export type PanelRegistry = {
  [K in PanelType]: PanelConfig
}

/**
 * Panel Data Types
 * 
 * Type-safe data structures for different panel types
 */
export interface PanelDataTypes {
  [PanelType.CART]: {
    items?: any[]
    newItem?: any
    source?: string
    autoClose?: boolean
  }
  [PanelType.AI_ASSISTANT]: {
    query?: string
    context?: string
    userPreferences?: Record<string, any>
    sessionId?: string
  }
  [PanelType.HELP]: {
    topic?: string
    searchQuery?: string
    source?: string
  }
  [PanelType.PRODUCT_COMPARE]: {
    products: string[]
    source?: string
    aiContext?: any
  }
  [PanelType.WISHLIST]: {
    productId?: string
    action?: 'add' | 'remove' | 'view'
  }
  [PanelType.REVIEWS]: {
    productId?: string
    reviewId?: string
    action?: 'view' | 'write' | 'edit'
  }
  [PanelType.FILTER]: {
    filters?: Record<string, any>
    activeFilters?: Record<string, any>
    onFilterChange?: (filters: Record<string, any>) => void
  }
}

/**
 * Type-safe panel opening function signature
 */
export type OpenPanelFunction = <T extends PanelType>(
  type: T,
  data?: PanelDataTypes[T],
  title?: string
) => void

/**
 * Panel Status Enum
 * 
 * Represents the current status of a panel
 */
export enum PanelStatus {
  CLOSED = 'closed',
  OPENING = 'opening',
  OPEN = 'open',
  CLOSING = 'closing'
}

/**
 * Panel Animation States
 */
export enum PanelAnimationState {
  IDLE = 'idle',
  ENTERING = 'entering',
  ENTERED = 'entered',
  EXITING = 'exiting',
  EXITED = 'exited'
}

/**
 * Panel Position Enum
 * 
 * Defines where panels can be positioned
 */
export enum PanelPosition {
  RIGHT = 'right',
  LEFT = 'left',
  TOP = 'top',
  BOTTOM = 'bottom',
  CENTER = 'center'
}

/**
 * Panel Size Enum
 * 
 * Standard panel sizes
 */
export enum PanelSize {
  SMALL = 'small',    // 320px
  MEDIUM = 'medium',  // 400px
  LARGE = 'large',    // 480px
  EXTRA_LARGE = 'xl'  // 600px
}

/**
 * Default Panel Configurations
 */
export const DEFAULT_PANEL_CONFIG: PanelRegistry = {
  [PanelType.CART]: {
    defaultTitle: 'Shopping Cart',
    icon: '🛒',
    priority: 100,
    enabled: true
  },
  [PanelType.AI_ASSISTANT]: {
    defaultTitle: 'AI Shopping Assistant',
    icon: '🤖',
    priority: 90,
    enabled: true
  },
  [PanelType.HELP]: {
    defaultTitle: 'Help & Support',
    icon: '❓',
    priority: 80,
    enabled: true
  },
  [PanelType.PRODUCT_COMPARE]: {
    defaultTitle: 'Compare Products',
    icon: '⚖️',
    priority: 70,
    enabled: false
  },
  [PanelType.WISHLIST]: {
    defaultTitle: 'Wishlist',
    icon: '❤️',
    priority: 60,
    enabled: false
  },
  [PanelType.REVIEWS]: {
    defaultTitle: 'Reviews',
    icon: '⭐',
    priority: 50,
    enabled: false
  },
  [PanelType.FILTER]: {
    defaultTitle: 'Filters',
    icon: '🔍',
    priority: 40,
    enabled: true
  }
}

/**
 * Type Guards
 */
export const isPanelType = (value: any): value is PanelType => {
  return Object.values(PanelType).includes(value)
}

export const isPanelState = (value: any): value is PanelState => {
  return (
    value &&
    typeof value === 'object' &&
    'type' in value &&
    'timestamp' in value &&
    'title' in value
  )
}

/**
 * Utility Types
 */
export type PanelTypeKeys = keyof typeof PanelType
export type PanelDataType<T extends PanelType> = PanelDataTypes[T]
export type AnyPanelData = PanelDataTypes[keyof PanelDataTypes]