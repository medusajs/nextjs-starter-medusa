"use client"

import React from "react"
import { useCompanionPanel } from "@lib/context/companion-panel-context"
import { usePanelResize } from "@lib/hooks/use-panel-resize"
import { HttpTypes } from "@medusajs/types"
import CartPanelContent from "../cart-panel-content"
import HelpPanelContent from "../help-panel-content"
import AIAssistantPanelContent from "../ai-assistant-panel-content"
import FilterPanelContent from "../filter-panel-content"

const PanelComponents = {
  'cart': CartPanelContent,
  'ai-assistant': AIAssistantPanelContent,
  'help': HelpPanelContent,
  'filter': FilterPanelContent,
}

interface ResizableCompanionPanelProps {
  cart?: HttpTypes.StoreCart | null
}

const ResizableCompanionPanel: React.FC<ResizableCompanionPanelProps> = ({ cart }) => {
  const { isOpen, currentPanel, closePanel, isMobile, setPanelWidth } = useCompanionPanel()
  
  const {
    width,
    isResizing,
    handleMouseDown,
    resizerRef
  } = usePanelResize({
    minWidth: 350,
    maxWidthVw: 50,
    marginEm: 2,
    cookieKey: 'companion-panel-width',
    defaultWidth: 400,
    enabled: !isMobile && isOpen // Only enable on desktop when panel is open
  })

  // Sync panel width with context
  React.useEffect(() => {
    if (!isMobile && isOpen) {
      setPanelWidth(width)
    }
  }, [width, isMobile, isOpen, setPanelWidth])

  if (!isOpen || !currentPanel) {
    return null
  }

  const PanelComponent = PanelComponents[currentPanel.type]
  
  if (!PanelComponent) {
    return (
      <div 
        className="companion-panel companion-panel--open"
        style={{ width: isMobile ? undefined : width }}
      >
        <div className="companion-panel__container">
          <div className="p-4 text-center text-gray-500">
            Panel type "{currentPanel.type}" not implemented
          </div>
        </div>
      </div>
    )
  }

  const panelProps = {
    data: currentPanel.data,
    ...(currentPanel.type === 'cart' && { cart }),
  }

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className="companion-backdrop companion-backdrop--open"
        onClick={closePanel}
      />

      {/* Resizable Companion Panel */}
      <div 
        className={`
          companion-panel companion-panel--open
          ${isResizing ? 'select-none' : ''}
        `}
        style={{ 
          '--panel-width': isMobile ? undefined : `${width}px`,
          width: isMobile ? undefined : `${width}px`,
          transition: isResizing ? 'none' : 'transform 300ms ease-in-out'
        } as React.CSSProperties}
      >
        {/* Resize Handle - Only on desktop */}
        {!isMobile && (
          <div
            ref={resizerRef}
            className={`
              absolute left-0 top-0 bottom-0 w-1 cursor-col-resize 
              hover:bg-blue-400 active:bg-blue-500 transition-colors
              ${isResizing ? 'bg-blue-500' : 'bg-transparent hover:bg-blue-200'}
            `}
            onMouseDown={handleMouseDown}
            title="Drag to resize panel"
          >
            {/* Visual indicator */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gray-300 rounded-r opacity-50 hover:opacity-100 transition-opacity" />
          </div>
        )}

        <div className="companion-panel__container">
          <PanelComponent {...panelProps} />
        </div>
      </div>
    </>
  )
}

export default ResizableCompanionPanel