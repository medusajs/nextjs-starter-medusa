"use client"

import React from "react"
import { useCompanionPanel, getPanelConfig } from "@lib/context/companion-panel-context"
import { Button } from "@medusajs/ui"

const PanelDemoButtons: React.FC = () => {
  const { openPanel, currentPanel, canGoBack, goBack, historyCount, closePanel } = useCompanionPanel()

  return (
    <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50">
      <h3 className="text-sm font-medium mb-3">🤖 AI Commerce Demo</h3>
      
      {/* Panel Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <Button 
          size="small" 
          variant="secondary"
          onClick={() => openPanel('ai-assistant', { context: 'shopping' })}
        >
          🤖 AI Assistant
        </Button>
        <Button 
          size="small" 
          variant="secondary"
          onClick={() => openPanel('product-compare', { products: ['id1', 'id2'] })}
        >
          ⚖️ Compare
        </Button>
        <Button 
          size="small" 
          variant="secondary"
          onClick={() => openPanel('wishlist')}
        >
          ❤️ Wishlist
        </Button>
        <Button 
          size="small" 
          variant="secondary"
          onClick={() => openPanel('help', { topic: 'shipping' })}
        >
          ❓ Help
        </Button>
      </div>

      {/* Navigation Controls */}
      <div className="flex gap-2 mb-2">
        <Button 
          size="small" 
          variant="outline" 
          onClick={goBack}
          disabled={!canGoBack}
        >
          ← Back
        </Button>
        <Button 
          size="small" 
          variant="outline" 
          onClick={closePanel}
        >
          ✕ Close
        </Button>
      </div>

      {/* Status */}
      <div className="text-xs text-gray-500">
        Current: {currentPanel?.type || 'None'}<br/>
        History: {historyCount} panels
      </div>
    </div>
  )
}

export default PanelDemoButtons