"use client"

import { useEffect, useRef, useState, useCallback } from 'react'

// Breakpoint definitions
export const BREAKPOINTS = {
  sm: 640,   // Small - mobile landscape, small tablets
  md: 768,   // Medium - tablets
  lg: 1024,  // Large - desktop
  xl: 1280,  // Extra large - wide desktop
} as const

export const SEMANTIC_BREAKPOINTS = {
  mobile: 640,    // Mobile devices
  tablet: 1024,   // Tablet devices  
  desktop: 1280,  // Desktop devices
} as const

export type BreakpointSize = keyof typeof BREAKPOINTS
export type SemanticSize = keyof typeof SEMANTIC_BREAKPOINTS

interface ContentMediaQuery {
  // Current measurements
  contentWidth: number
  
  // Size-based breakpoints (xs/sm/md/lg/xl)
  currentSize: BreakpointSize | 'xs'
  
  // Semantic breakpoints (mobile/tablet/desktop)  
  semanticSize: SemanticSize
  
  // Utilities
  isSize: (size: BreakpointSize | 'xs') => boolean
  isSemantic: (size: SemanticSize) => boolean
  isAtLeast: (size: BreakpointSize | 'xs') => boolean
  
  // Ref for the container element
  containerRef: React.RefObject<HTMLElement>
}

export const useContentMediaQuery = (): ContentMediaQuery => {
  const [contentWidth, setContentWidth] = useState(0)
  const [currentSize, setCurrentSize] = useState<BreakpointSize | 'xs'>('xs')
  const [semanticSize, setSemanticSize] = useState<SemanticSize>('mobile')
  const containerRef = useRef<HTMLElement>(null)

  // Calculate current breakpoint from width
  const calculateBreakpoint = useCallback((width: number): BreakpointSize | 'xs' => {
    if (width >= BREAKPOINTS.xl) return 'xl'
    if (width >= BREAKPOINTS.lg) return 'lg'
    if (width >= BREAKPOINTS.md) return 'md'
    if (width >= BREAKPOINTS.sm) return 'sm'
    return 'xs'
  }, [])

  // Calculate semantic size from width
  const calculateSemantic = useCallback((width: number): SemanticSize => {
    if (width >= SEMANTIC_BREAKPOINTS.desktop) return 'desktop'
    if (width >= SEMANTIC_BREAKPOINTS.tablet) return 'tablet'
    return 'mobile'
  }, [])

  // Measure content area and update breakpoints
  const measureContentArea = useCallback(() => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const width = rect.width
    
    setContentWidth(width)
    
    const newSize = calculateBreakpoint(width)
    const newSemantic = calculateSemantic(width)
    
    if (newSize !== currentSize) {
      setCurrentSize(newSize)
    }
    
    if (newSemantic !== semanticSize) {
      setSemanticSize(newSemantic)
    }
  }, [calculateBreakpoint, calculateSemantic, currentSize, semanticSize])

  // Set up ResizeObserver for content area measurement
  useEffect(() => {
    measureContentArea()

    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width
        setContentWidth(width)
        setCurrentSize(calculateBreakpoint(width))
        setSemanticSize(calculateSemantic(width))
      }
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [calculateBreakpoint, calculateSemantic, measureContentArea])

  // Utility functions
  const isSize = useCallback((size: BreakpointSize | 'xs') => {
    return currentSize === size
  }, [currentSize])

  const isSemantic = useCallback((size: SemanticSize) => {
    return semanticSize === size
  }, [semanticSize])

  const isAtLeast = useCallback((size: BreakpointSize | 'xs') => {
    const sizes: (BreakpointSize | 'xs')[] = ['xs', 'sm', 'md', 'lg', 'xl']
    const currentIndex = sizes.indexOf(currentSize)
    const targetIndex = sizes.indexOf(size)
    return currentIndex >= targetIndex
  }, [currentSize])

  return {
    contentWidth,
    currentSize,
    semanticSize,
    isSize,
    isSemantic,
    isAtLeast,
    containerRef,
  }
}