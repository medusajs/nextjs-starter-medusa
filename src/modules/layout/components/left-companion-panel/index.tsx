"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLeftPanel } from '@lib/context/left-panel-context'
import { backdropFadePreset } from '@lib/motion'
import ResizeHandle from '@modules/common/components/resize-handle'

const resizeHandleWidth = 8

export default function LeftCompanionPanel({ children }: { children: React.ReactNode }) {
  const { isOpen, width, setWidth, isMobile, close } = useLeftPanel()
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop on mobile only */}
          {isMobile && (
            <motion.div className="fixed inset-0 z-[65]" {...backdropFadePreset()} onClick={close} />
          )}
          <motion.aside
            id="left-companion-panel"
            className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-[66] overflow-hidden"
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


