"use client"

import React from "react"
import { getEnabledFeatures, getLayoutConfig } from "@lib/config/companion-config"

// Import trigger components
import HelpTriggerButton from "../help-trigger-button"
import AIChatTriggerButton from "../ai-chat-trigger-button"

interface ConfigurableCompanionTriggersProps {
  className?: string
}

const ConfigurableCompanionTriggers: React.FC<ConfigurableCompanionTriggersProps> = ({ 
  className = "contents" 
}) => {
  const enabledFeatures = getEnabledFeatures()
  const layoutConfig = getLayoutConfig()
  
  // Map feature keys to their components
  const componentMap: Record<string, React.ComponentType> = {
    'helpCompanion': HelpTriggerButton,
    'aiCompanion': AIChatTriggerButton,
  }
  
  // Apply layout constraints
  const maxButtons = layoutConfig.maxVisibleButtons
  const visibleFeatures = enabledFeatures.slice(0, maxButtons)

  if (visibleFeatures.length === 0) {
    return null
  }

  return (
    <>
      {visibleFeatures.map((feature) => {
        const Component = componentMap[feature.key]
        if (!Component) {
          return (
            <button
              key={feature.key}
              className="nav-icon-btn"
              title={`${feature.displayName} (not implemented)`}
            >
              {feature.icon}
            </button>
          )
        }
        return <Component key={feature.key} />
      })}
    </>
  )
}

export default ConfigurableCompanionTriggers