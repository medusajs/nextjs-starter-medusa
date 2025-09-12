"use client"

import * as React from "react"

interface SmartStickyOptions {
  hideThreshold?: number // px scrolled down before hide
  showThreshold?: number // px scrolled up before show
  freeze?: boolean // when true, keep bar visible and reset accumulators
}

export function useSmartStickyBar(options: SmartStickyOptions = {}) {
  const { hideThreshold = 240, showThreshold = 24, freeze = false } = options

  const [hidden, setHidden] = React.useState(false)
  const [condensed, setCondensed] = React.useState(false)

  const lastYRef = React.useRef<number>(0)
  const downAccRef = React.useRef<number>(0)
  const upAccRef = React.useRef<number>(0)
  const rafRef = React.useRef<number | null>(null)
  const directionRef = React.useRef<"up" | "down" | "none">("none")

  React.useEffect(() => {
    if (freeze) {
      // Unhide and reset when frozen
      setHidden(false)
      downAccRef.current = 0
      upAccRef.current = 0
      lastYRef.current = window.scrollY
      directionRef.current = "none"
      return
    }

    // Initialize last known position on mount/attach
    lastYRef.current = window.scrollY
    directionRef.current = "none"

    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null
        const y = window.scrollY
        const last = lastYRef.current
        const dy = y - last
        lastYRef.current = y

        // Condensed once user has scrolled a bit
        setCondensed(y > 60)

        // Near top always show
        if (y < 20) {
          setHidden(false)
          downAccRef.current = 0
          upAccRef.current = 0
          directionRef.current = "none"
          return
        }

        if (dy > 0) {
          // scrolling down
          if (directionRef.current !== "down") {
            // direction change: reset accumulators relevantly
            downAccRef.current = 0
          }
          downAccRef.current += dy
          upAccRef.current = 0
          directionRef.current = "down"
          if (!hidden && downAccRef.current >= hideThreshold) {
            setHidden(true)
            downAccRef.current = 0
          }
        } else if (dy < 0) {
          // scrolling up
          if (directionRef.current !== "up") {
            upAccRef.current = 0
          }
          upAccRef.current += -dy
          downAccRef.current = 0
          directionRef.current = "up"
          if (hidden && upAccRef.current >= showThreshold) {
            setHidden(false)
            upAccRef.current = 0
          }
        }
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [hideThreshold, showThreshold, freeze])

  return { hidden, condensed }
}


