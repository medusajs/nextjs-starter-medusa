"use client"

import React from "react"
import { useCompanionPanel } from "@lib/context/companion-panel-context"
import CartPanelContent from "../cart-panel-content"
import HelpPanelContent from "../help-panel-content"
import AIAssistantPanelContent from "../ai-assistant-panel-content"
import { HttpTypes } from "@medusajs/types"

// Panel Components Map
interface PanelComponentProps {
  data?: any
}

const PanelComponents = {
  'cart': CartPanelContent,
  'ai-assistant': AIAssistantPanelContent,
  'help': HelpPanelContent,
  'product-compare': () => <div className="p-4">Product Compare Panel (Coming Soon)</div>,
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
  
  if (!PanelComponent) {
    return (
      <div className="companion-panel companion-panel--open">
        <div className="companion-panel__container">
          <div className="p-4 text-center text-gray-500">
            Panel type "{currentPanel.type}" not implemented
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