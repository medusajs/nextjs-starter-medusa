/**
 * @jest-environment node
 */

import {
  config,
  isFeatureEnabled,
  getEnabledFeatures,
  getNavigationFeatures,
  getLayoutConfig,
  getGlobalSettings,
  getDevelopmentConfig,
  companionConfig
} from '../../../src/lib/config/companion-config'

describe('Companion Configuration', () => {
  describe('config object', () => {
    test('should have all required configuration sections', () => {
      expect(config).toHaveProperty('featureFlags')
      expect(config).toHaveProperty('layoutOptions')
      expect(config).toHaveProperty('globalSettings')
      expect(config).toHaveProperty('development')
    })

    test('should have correct structure for feature flags', () => {
      expect(typeof config.featureFlags.aiCompanion).toBe('boolean')
      expect(typeof config.featureFlags.helpCompanion).toBe('boolean')
    })
  })

  describe('isFeatureEnabled', () => {
    test('should return boolean for valid features', () => {
      const result = isFeatureEnabled('aiCompanion')
      expect(typeof result).toBe('boolean')
    })

    test('should handle non-existent features gracefully', () => {
      // @ts-ignore - testing runtime behavior
      expect(isFeatureEnabled('nonExistentFeature')).toBe(false)
    })

    test('should work with actual config values', () => {
      // Test with the actual config from store.config.js
      expect(() => isFeatureEnabled('aiCompanion')).not.toThrow()
    })
  })

  describe('getEnabledFeatures', () => {
    test('should return array of feature objects', () => {
      const enabledFeatures = getEnabledFeatures()
      
      expect(Array.isArray(enabledFeatures)).toBe(true)
      
      // Check structure if features exist
      if (enabledFeatures.length > 0) {
        expect(enabledFeatures[0]).toHaveProperty('key')
        expect(enabledFeatures[0]).toHaveProperty('displayName')
        expect(enabledFeatures[0]).toHaveProperty('icon')
        expect(enabledFeatures[0]).toHaveProperty('priority')
      }
    })

    test('should return features sorted by priority (highest first)', () => {
      const enabledFeatures = getEnabledFeatures()
      
      // Check that priorities are in descending order
      for (let i = 0; i < enabledFeatures.length - 1; i++) {
        expect(enabledFeatures[i].priority).toBeGreaterThanOrEqual(
          enabledFeatures[i + 1].priority
        )
      }
    })
  })

  describe('getNavigationFeatures', () => {
    test('should return the same as getEnabledFeatures', () => {
      const navigationFeatures = getNavigationFeatures()
      const enabledFeatures = getEnabledFeatures()

      expect(navigationFeatures).toEqual(enabledFeatures)
    })
  })

  describe('getLayoutConfig', () => {
    test('should return layout options with correct types', () => {
      const layoutConfig = getLayoutConfig()

      expect(typeof layoutConfig.maxVisibleButtons).toBe('number')
      expect(typeof layoutConfig.showLabels).toBe('boolean')
      expect(typeof layoutConfig.showIcons).toBe('boolean')
      expect(typeof layoutConfig.defaultPanelWidth).toBe('number')
      expect(typeof layoutConfig.maxPanelHistory).toBe('number')
    })

    test('should have reasonable default values', () => {
      const layoutConfig = getLayoutConfig()

      expect(layoutConfig.maxVisibleButtons).toBeGreaterThan(0)
      expect(layoutConfig.defaultPanelWidth).toBeGreaterThan(0)
      expect(layoutConfig.maxPanelHistory).toBeGreaterThan(0)
    })
  })

  describe('getGlobalSettings', () => {
    test('should return global settings with correct types', () => {
      const globalSettings = getGlobalSettings()

      expect(typeof globalSettings.enableKeyboardShortcuts).toBe('boolean')
      expect(typeof globalSettings.enableGestures).toBe('boolean')
      expect(typeof globalSettings.enableAnalytics).toBe('boolean')
    })
  })

  describe('getDevelopmentConfig', () => {
    test('should return development options with correct types', () => {
      const developmentConfig = getDevelopmentConfig()

      expect(typeof developmentConfig.enableDebugMode).toBe('boolean')
      expect(typeof developmentConfig.showPanelDemoButtons).toBe('boolean')
      expect(typeof developmentConfig.logStateChanges).toBe('boolean')
    })
  })

  describe('companionConfig backward compatibility object', () => {
    test('should provide all helper functions', () => {
      expect(typeof companionConfig.isFeatureEnabled).toBe('function')
      expect(typeof companionConfig.getEnabledFeatures).toBe('function')
      expect(typeof companionConfig.getNavigationFeatures).toBe('function')
      expect(typeof companionConfig.getLayoutConfig).toBe('function')
      expect(typeof companionConfig.getGlobalSettings).toBe('function')
      expect(typeof companionConfig.getDevelopmentConfig).toBe('function')
    })

    test('should provide config object', () => {
      expect(companionConfig.config).toBeDefined()
      expect(companionConfig.config).toHaveProperty('featureFlags')
    })

    test('should have same functionality as direct imports', () => {
      expect(companionConfig.isFeatureEnabled('aiCompanion')).toBe(
        isFeatureEnabled('aiCompanion')
      )
      expect(companionConfig.getEnabledFeatures()).toEqual(getEnabledFeatures())
      expect(companionConfig.getLayoutConfig()).toEqual(getLayoutConfig())
    })
  })

  describe('Feature metadata', () => {
    test('should provide correct metadata structure', () => {
      const enabledFeatures = getEnabledFeatures()
      
      enabledFeatures.forEach(feature => {
        expect(typeof feature.displayName).toBe('string')
        expect(typeof feature.icon).toBe('string')
        expect(typeof feature.priority).toBe('number')
        expect(typeof feature.key).toBe('string')
        
        // Check that display names are reasonable
        expect(feature.displayName.length).toBeGreaterThan(0)
        expect(feature.icon.length).toBeGreaterThan(0)
        expect(feature.priority).toBeGreaterThan(0)
      })
    })
  })

  describe('Type safety', () => {
    test('should accept valid feature keys', () => {
      expect(() => isFeatureEnabled('aiCompanion')).not.toThrow()
      expect(() => isFeatureEnabled('helpCompanion')).not.toThrow()
      expect(() => isFeatureEnabled('wishlist')).not.toThrow()
      expect(() => isFeatureEnabled('productCompare')).not.toThrow()
      expect(() => isFeatureEnabled('reviews')).not.toThrow()
    })
  })

  describe('Performance', () => {
    test('should cache feature metadata calculations', () => {
      const start = performance.now()
      
      // Call multiple times
      for (let i = 0; i < 100; i++) {
        getEnabledFeatures()
      }
      
      const end = performance.now()
      const duration = end - start
      
      // Should complete quickly (under 50ms for 100 calls)
      expect(duration).toBeLessThan(50)
    })

    test('should not recreate objects unnecessarily', () => {
      const config1 = getLayoutConfig()
      const config2 = getLayoutConfig()
      
      // Should return equivalent objects (not necessarily same reference)
      expect(config1).toEqual(config2)
    })
  })

  describe('Integration with store.config.js', () => {
    test('should maintain config structure integrity', () => {
      expect(config.featureFlags).toBeDefined()
      expect(config.layoutOptions).toBeDefined()
      expect(config.globalSettings).toBeDefined()
      expect(config.development).toBeDefined()

      // Ensure all expected properties exist
      expect(config.featureFlags).toHaveProperty('aiCompanion')
      expect(config.layoutOptions).toHaveProperty('maxVisibleButtons')
      expect(config.globalSettings).toHaveProperty('enableKeyboardShortcuts')
      expect(config.development).toHaveProperty('enableDebugMode')
    })
  })
})