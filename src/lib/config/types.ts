// TypeScript types for store configuration

export interface StoreConfig {
  featureFlags: {
    aiCompanion: boolean
    helpCompanion: boolean
    wishlist: boolean
    productCompare: boolean
    reviews: boolean
  }
  layoutOptions: {
    maxVisibleButtons: number
    showLabels: boolean
    showIcons: boolean
    defaultPanelWidth: number
    maxPanelHistory: number
  }
  globalSettings: {
    enableKeyboardShortcuts: boolean
    enableGestures: boolean
    enableAnalytics: boolean
  }
  development: {
    enableDebugMode: boolean
    showPanelDemoButtons: boolean
    logStateChanges: boolean
  }
}