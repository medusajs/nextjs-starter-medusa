"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useLeftPanel } from '@lib/context/left-panel-context'
import { backdropFadePreset } from '@lib/motion'
import ResizeHandle from '@modules/common/components/resize-handle'

const resizeHandleWidth = 8

export default function LeftCompanionPanel({ children }: { children: React.ReactNode }) {
  const { isOpen, width, setWidth, isMobile, close } = useLeftPanel()
  const pathname = usePathname()
  const panelRef = React.useRef<HTMLDivElement | null>(null)
  const startXRef = React.useRef(0)
  const startWidthRef = React.useRef(width)
  const [isResizing, setIsResizing] = React.useState(false)
  const onMouseMove = React.useCallback((e: MouseEvent) => {
    const delta = e.clientX - startXRef.current
    const newWidth = Math.max(220, Math.min(480, startWidthRef.current + delta))
    setWidth(newWidth)
  }, [setWidth])
  const onMouseUp = React.useCallback(() => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.body.classList.remove('resizing')
    document.body.style.cursor = ''
    setIsResizing(false)
  }, [onMouseMove])
  const onMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    startXRef.current = e.clientX
    startWidthRef.current = width
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.body.classList.add('resizing')
    document.body.style.cursor = 'col-resize'
    setIsResizing(true)
  }, [onMouseMove, onMouseUp, width])

  // Body scroll locking handled centrally in UnifiedLayoutWrapper

  // Auto-close the menu on route changes when on mobile
  React.useEffect(() => {
    if (isMobile && isOpen) {
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop on mobile only */}
          {isMobile && (
            <motion.div className="fixed left-0 right-0 bottom-0 top-16 z-[40] companion-backdrop companion-backdrop--open" {...backdropFadePreset()} onClick={close} />
          )}
          <motion.aside
            id="left-companion-panel"
            className={`fixed top-[var(--header-height,4rem)] left-0 h-[calc(100vh-var(--header-height,4rem))] bg-white z-[80] overflow-hidden left-panel border-r border-gray-200`}
            style={{ width: isMobile ? '85vw' : width }}
            initial={{ x: '-100%' }}
            animate={{ x: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ x: '-100%', transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
            ref={panelRef as React.RefObject<HTMLDivElement>}
          >
            {/* Resize handle (desktop) */}
            {!isMobile && (
              <ResizeHandle side="right" isResizing={isResizing} onMouseDown={onMouseDown} />
            )}
            <div className="h-full flex flex-col">
              {children}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}


