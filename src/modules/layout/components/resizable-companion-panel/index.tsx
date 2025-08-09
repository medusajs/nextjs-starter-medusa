"use client"

import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { panelSlidePreset, backdropFadePreset } from "@lib/motion"
import { useCompanionPanel } from "@lib/context/companion-panel-context"
import { usePanelResize } from "@lib/hooks/use-panel-resize"
import ResizeHandle from "@modules/common/components/resize-handle"
import { HttpTypes } from "@medusajs/types"
import CartPanelContent from "../cart-panel-content"
import HelpPanelContent from "../help-panel-content"
import AIAssistantPanelContent from "../ai-assistant-panel-content"
import FilterPanelContent from "../filter-panel-content"

const PanelComponents = {
  'cart': CartPanelContent,
  'aiCompanion': AIAssistantPanelContent,
  'helpCompanion': HelpPanelContent,
  'filter': FilterPanelContent,
}

// Framer Motion handles enter/exit presence; no deferred class needed

interface ResizableCompanionPanelProps {
  cart?: HttpTypes.StoreCart | null
}

const ResizableCompanionPanel: React.FC<ResizableCompanionPanelProps> = ({ cart }) => {
  const { isOpen, currentPanel, closePanel, isMobile, setPanelWidth } = useCompanionPanel()
  // Anim state machine
  const EXIT_DURATION_MS = 200
  const ENTER_DURATION_MS = 300
  type PanelAnimState = 'closed' | 'opening' | 'open' | 'closing'
  const [animState, setAnimState] = React.useState<PanelAnimState>('closed')
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep the last non-null panel so we can render during exit
  const lastPanelRef = React.useRef<typeof currentPanel>(null)
  React.useEffect(() => {
    if (currentPanel) {
      lastPanelRef.current = currentPanel
    }
  }, [currentPanel])

  // Drive local animation state machine based on provider's isOpen
  React.useEffect(() => {
    if (isOpen) {
      if (animState === 'closed' || animState === 'closing') {
        setAnimState('opening')
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          setAnimState('open')
          timerRef.current = null
        }, ENTER_DURATION_MS)
      }
    } else {
      if (animState === 'opening' || animState === 'open') {
        setAnimState('closing')
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          setAnimState('closed')
          timerRef.current = null
        }, EXIT_DURATION_MS)
      }
    }
  }, [isOpen, animState])

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])
  
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

  // Ref for panel node (for potential future needs)
  const panelNodeRef = React.useRef<HTMLDivElement | null>(null)
  const focusRef = React.useRef<HTMLDivElement | null>(null)

  // Body scroll locking is handled centrally in UnifiedLayoutWrapper

  // Render while not fully closed
  const PanelComponent = currentPanel ? PanelComponents[currentPanel.type] : undefined
  const panelProps = currentPanel?.type === 'cart'
    ? { data: currentPanel?.data, cart }
    : { data: currentPanel?.data }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="companion-backdrop companion-backdrop--open"
            {...backdropFadePreset()}
            onClick={closePanel}
          />

          {/* Panel */}
          <motion.aside
            className={`companion-panel companion-panel--open ${isResizing ? 'select-none' : ''}`}
            style={{
              '--panel-width': isMobile ? undefined : `${width}px`,
              width: isMobile ? undefined : `${width}px`,
            } as React.CSSProperties}
            {...panelSlidePreset('right')}
            ref={panelNodeRef as React.RefObject<HTMLDivElement>}
            role={isMobile ? 'dialog' : undefined}
            aria-modal={isMobile ? true : undefined}
            aria-label={currentPanel?.title || currentPanel?.type || 'Panel'}
            tabIndex={-1}
          >
            {/* Resize Handle - Only on desktop */}
            {!isMobile && (
              <ResizeHandle side="left" isResizing={isResizing} ref={resizerRef as React.RefObject<HTMLDivElement>} onMouseDown={handleMouseDown} />
            )}

            <div className="companion-panel__container" ref={focusRef as React.RefObject<HTMLDivElement>}>
              {PanelComponent && <PanelComponent {...panelProps} />}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default ResizableCompanionPanel