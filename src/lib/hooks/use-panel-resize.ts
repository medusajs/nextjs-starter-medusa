import { useState, useEffect, useCallback, useRef } from 'react'

interface UsePanelResizeOptions {
  minWidth: number      // e.g., 350
  maxWidthVw: number   // e.g., 50 (for 50vw)
  marginEm: number     // e.g., 2 (for 2em)
  cookieKey: string    // e.g., 'companion-panel-width'
  defaultWidth: number // e.g., 400
  enabled: boolean     // Only enable above sm breakpoint
}

interface UsePanelResizeReturn {
  width: number
  isResizing: boolean
  handleMouseDown: (e: React.MouseEvent) => void
  resetToDefault: () => void
  resizerRef: React.RefObject<HTMLDivElement>
}

/**
 * Hook for managing dragable panel resize with constraints and persistence
 */
export const usePanelResize = ({
  minWidth,
  maxWidthVw,
  marginEm,
  cookieKey,
  defaultWidth,
  enabled
}: UsePanelResizeOptions): UsePanelResizeReturn => {
  const [width, setWidth] = useState(defaultWidth)
  const [isResizing, setIsResizing] = useState(false)
  const resizerRef = useRef<HTMLDivElement>(null)
  const initialMouseX = useRef<number>(0)
  const initialWidth = useRef<number>(0)

  // Calculate max width based on viewport
  const getMaxWidth = useCallback(() => {
    const viewportWidth = window.innerWidth
    const marginPx = marginEm * 16 // Convert em to px (assuming 16px base)
    return (viewportWidth * maxWidthVw / 100) - marginPx
  }, [maxWidthVw, marginEm])

  // Load width from cookies on mount
  useEffect(() => {
    if (!enabled) return

    const savedWidth = getCookie(cookieKey)
    if (savedWidth) {
      const parsedWidth = parseInt(savedWidth, 10)
      const maxWidth = getMaxWidth()
      
      // Ensure saved width is within constraints
      const constrainedWidth = Math.max(
        minWidth, 
        Math.min(parsedWidth, maxWidth)
      )
      
      setWidth(constrainedWidth)
    }
  }, [enabled, cookieKey, minWidth, getMaxWidth])

  // Save width to cookies when it changes
  useEffect(() => {
    if (!enabled) return
    setCookie(cookieKey, width.toString(), 30) // 30 days
  }, [width, cookieKey, enabled])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!enabled) return

    e.preventDefault()
    setIsResizing(true)
    initialMouseX.current = e.clientX
    initialWidth.current = width

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = initialMouseX.current - e.clientX // Negative because we're resizing from the left
      const newWidth = initialWidth.current + deltaX
      const maxWidth = getMaxWidth()

      // Apply constraints
      const constrainedWidth = Math.max(
        minWidth,
        Math.min(newWidth, maxWidth)
      )

      setWidth(constrainedWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [enabled, width, minWidth, getMaxWidth])

  const resetToDefault = useCallback(() => {
    if (!enabled) return
    setWidth(defaultWidth)
  }, [enabled, defaultWidth])

  return {
    width,
    isResizing,
    handleMouseDown,
    resetToDefault,
    resizerRef
  }
}

// Cookie utilities
function setCookie(name: string, value: string, days: number) {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

function getCookie(name: string): string | null {
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  
  return null
}