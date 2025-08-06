"use client"

import React, { useState } from "react"
import { companionConfig, FeatureConfig } from "@lib/config/companion-config"
import { Switch } from "@headlessui/react"

interface ConfigManagerProps {
  className?: string
}

const CompanionConfigManager: React.FC<ConfigManagerProps> = ({ className = "" }) => {
  const [features, setFeatures] = useState(() => companionConfig.getEnabledFeatures())
  const [allFeatures, setAllFeatures] = useState(() => companionConfig.config.features)

  const handleFeatureToggle = (featureKey: string, enabled: boolean) => {
    // Update the configuration
    companionConfig.updateFeature(featureKey, { enabled })
    
    // Update local state
    setAllFeatures(prev => ({
      ...prev,
      [featureKey]: { ...prev[featureKey], enabled }
    }))
    
    if (enabled) {
      setFeatures(prev => ({ ...prev, [featureKey]: allFeatures[featureKey] }))
    } else {
      setFeatures(prev => {
        const updated = { ...prev }
        delete updated[featureKey]
        return updated
      })
    }
  }

  const handlePriorityChange = (featureKey: string, priority: number) => {
    companionConfig.updateFeature(featureKey, { priority })
    setAllFeatures(prev => ({
      ...prev,
      [featureKey]: { ...prev[featureKey], priority }
    }))
  }

  const handleNavigationToggle = (featureKey: string, showInNavigation: boolean) => {
    companionConfig.updateFeature(featureKey, { showInNavigation })
    setAllFeatures(prev => ({
      ...prev,
      [featureKey]: { ...prev[featureKey], showInNavigation }
    }))
  }

  const sortedFeatures = Object.entries(allFeatures).sort(([, a], [, b]) => b.priority - a.priority)

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Companion Panel Configuration</h2>
        <p className="text-gray-600">Configure which companion panel features are enabled and how they appear.</p>
      </div>

      {/* Global Settings */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Global Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">System Enabled</span>
            <Switch
              checked={companionConfig.getGlobalSettings().enabled}
                          onChange={(enabled) => {
              companionConfig.config.global.enabled = enabled
            }}
              className={`${
                companionConfig.getGlobalSettings().enabled ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  companionConfig.getGlobalSettings().enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Max Panel History</span>
            <input
              type="number"
              min="1"
              max="20"
              value={companionConfig.getGlobalSettings().maxPanelHistory}
              onChange={(e) => {
                companionConfig.config.global.maxPanelHistory = parseInt(e.target.value)
              }}
              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Feature Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Feature Configuration</h3>
        
        {sortedFeatures.map(([featureKey, feature]) => (
          <div key={featureKey} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{feature.displayName}</h4>
                  <p className="text-sm text-gray-500">Key: {featureKey}</p>
                </div>
              </div>
              <Switch
                checked={feature.enabled}
                onChange={(enabled) => handleFeatureToggle(featureKey, enabled)}
                className={`${
                  feature.enabled ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    feature.enabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>

            {feature.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Priority</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={feature.priority}
                    onChange={(e) => handlePriorityChange(featureKey, parseInt(e.target.value))}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Show in Nav</span>
                  <Switch
                    checked={feature.showInNavigation}
                    onChange={(showInNavigation) => handleNavigationToggle(featureKey, showInNavigation)}
                    className={`${
                      feature.showInNavigation ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        feature.showInNavigation ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Position</span>
                  <select
                    value={feature.position}
                    onChange={(e) => companionConfig.updateFeature(featureKey, { position: e.target.value as 'left' | 'right' })}
                    className="px-2 py-1 text-sm border border-gray-300 rounded"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Configuration Validation */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Configuration Status</h3>
        {(() => {
          const validation = companionConfig.validateConfig()
          return validation.valid ? (
            <p className="text-blue-700">✅ Configuration is valid</p>
          ) : (
            <div className="text-red-700">
              <p className="font-medium">❌ Configuration Issues:</p>
              <ul className="list-disc list-inside mt-2">
                {validation.errors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </div>
          )
        })()}
      </div>

      {/* Export/Import */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => {
            const config = JSON.stringify(companionConfig.config, null, 2)
            const blob = new Blob([config], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'companion-config.json'
            a.click()
            URL.revokeObjectURL(url)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Export Config
        </button>
        
        <button
          onClick={() => {
            window.location.reload() // Simple way to reset to default config
          }}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  )
}

export default CompanionConfigManager