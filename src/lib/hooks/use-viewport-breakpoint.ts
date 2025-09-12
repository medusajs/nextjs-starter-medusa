"use client"

import * as React from "react"

export const VIEW_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const

export type ViewBreakpoint = keyof typeof VIEW_BREAKPOINTS | 'xs'

export function useViewportBreakpoint() {
  const [size, setSize] = React.useState<ViewBreakpoint>('xs')

  React.useEffect(() => {
    const calc = () => {
      const w = window.innerWidth
      if (w >= VIEW_BREAKPOINTS.xl) return 'xl'
      if (w >= VIEW_BREAKPOINTS.lg) return 'lg'
      if (w >= VIEW_BREAKPOINTS.md) return 'md'
      if (w >= VIEW_BREAKPOINTS.sm) return 'sm'
      return 'xs'
    }
    const onResize = () => setSize(calc())
    setSize(calc())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const isAtLeast = React.useCallback((bp: ViewBreakpoint) => {
    const order: ViewBreakpoint[] = ['xs','sm','md','lg','xl']
    return order.indexOf(size) >= order.indexOf(bp)
  }, [size])

  return { size, isAtLeast }
}


