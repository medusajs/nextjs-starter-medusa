"use client"

import React, { createContext, useContext } from 'react'

type LeftPanelContextType = {
  isOpen: boolean
  width: number
  isMobile: boolean
  open: () => void
  close: () => void
  toggle: () => void
  setWidth: (w: number) => void
}

const LeftPanelContext = createContext<LeftPanelContextType | undefined>(undefined)

export const useLeftPanel = () => {
  const ctx = useContext(LeftPanelContext)
  if (!ctx) throw new Error('useLeftPanel must be used within LeftPanelProvider')
  return ctx
}

export const LeftPanelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [width, setWidth] = React.useState(280)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])
  const toggle = React.useCallback(() => setIsOpen((p) => !p), [])

  const value: LeftPanelContextType = {
    isOpen,
    width,
    isMobile,
    open,
    close,
    toggle,
    setWidth,
  }

  return <LeftPanelContext.Provider value={value}>{children}</LeftPanelContext.Provider>
}


