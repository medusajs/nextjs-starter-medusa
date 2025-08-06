"use client"

import React from "react"
import { useCompanionPanel } from "@lib/context/companion-panel-context"
import CartPanelContent from "../cart-panel-content"
import HelpPanelContent from "../help-panel-content"
import AIAssistantPanelContent from "../ai-assistant-panel-content"
import FilterPanelContent from "../filter-panel-content"
import { HttpTypes } from "@medusajs/types"

// Panel Components Map
interface PanelComponentProps {
  data?: any
  cart?: HttpTypes.StoreCart | null
}

const PanelComponents: Record<string, React.ComponentType<any>> = {
  'cart': CartPanelContent,
  'filter': FilterPanelContent,
  'aiCompanion': AIAssistantPanelContent,
  'helpCompanion': HelpPanelContent,
  'productCompare': () => <div className="p-4">Product Compare Panel (Coming Soon)</div>,
  'wishlist': () => <div className="p-4">Wishlist Panel (Coming Soon)</div>,
  'reviews': () => <div className="p-4">Reviews Panel (Coming Soon)</div>,
}

interface CompanionPanelProps {
  cart?: HttpTypes.StoreCart | null
}

const CompanionPanel: React.FC<CompanionPanelProps> = ({ cart }) => {
  const { isOpen, currentPanel, closePanel } = useCompanionPanel()

  if (!isOpen || !currentPanel) {
    return null
  }

  const PanelComponent = PanelComponents[currentPanel.type]
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Panel type:', currentPanel.type)
    console.log('Available panels:', Object.keys(PanelComponents))
    console.log('Component found:', !!PanelComponent)
  }
  
  if (!PanelComponent) {
    return (
      <div className="companion-panel companion-panel--open">
        <div className="companion-panel__container">
          <div className="p-4 text-center text-gray-500">
            Panel type "{currentPanel.type}" not implemented
            <br />
            <small>Available: {Object.keys(PanelComponents).join(', ')}</small>
          </div>
        </div>
      </div>
    )
  }

  // Pass relevant props based on panel type
  const panelProps = {
    data: currentPanel.data,
    ...(currentPanel.type === 'cart' && { cart }),
  }

  // Debug logging for component rendering
  if (process.env.NODE_ENV === 'development') {
    console.log('Rendering panel component:', currentPanel.type)
    console.log('Panel props:', panelProps)
  }

  return (
    <>
      {/* Backdrop - Only visible on mobile */}
      <div 
        className="companion-backdrop companion-backdrop--open"
        onClick={closePanel}
      />

      {/* Unified Companion Panel */}
      <div className="companion-panel companion-panel--open">
        <div className="companion-panel__container">
          <PanelComponent {...panelProps} />
        </div>
      </div>
    </>
  )
}

export default CompanionPanel