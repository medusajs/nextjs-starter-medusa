import storeConfig from '../../../store.config.js'
import type { StoreConfig } from './types'

// Cast the imported config to our TypeScript type
export const config: StoreConfig = storeConfig

// Feature metadata for UI display
const FEATURE_METADATA = {
  aiCompanion: {
    displayName: 'AI Shopping Assistant',
    icon: '🤖',
    priority: 90,
  },
  helpCompanion: {
    displayName: 'Help & Support',
    icon: '❓',
    priority: 80,
  },
  wishlist: {
    displayName: 'Wishlist',
    icon: '❤️',
    priority: 50,
  },
  productCompare: {
    displayName: 'Compare Products',
    icon: '⚖️',
    priority: 60,
  },
  reviews: {
    displayName: 'Reviews',
    icon: '⭐',
    priority: 40,
  },
} as const

// Simple helper functions
export const isFeatureEnabled = (featureKey: keyof StoreConfig['featureFlags']): boolean => {
  return config.featureFlags[featureKey] === true
}

export const getEnabledFeatures = () => {
  return Object.entries(config.featureFlags)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => ({
      key,
      ...FEATURE_METADATA[key as keyof typeof FEATURE_METADATA]
    }))
    .sort((a, b) => b.priority - a.priority)
}

export const getNavigationFeatures = () => {
  // All enabled features show in navigation (except contextual ones)
  return getEnabledFeatures()
}

export const getLayoutConfig = () => config.layoutOptions
export const getGlobalSettings = () => config.globalSettings
export const getDevelopmentConfig = () => config.development

// For backward compatibility with existing code
export const companionConfig = {
  isFeatureEnabled,
  getEnabledFeatures,
  getNavigationFeatures,
  getLayoutConfig,
  getGlobalSettings,
  getDevelopmentConfig,
  config,
}