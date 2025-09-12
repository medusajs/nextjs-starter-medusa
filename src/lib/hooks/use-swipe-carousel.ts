"use client"

import * as React from "react"

interface UseSwipeCarouselOptions {
  length: number
  index: number
  setIndex: (i: number) => void
  thresholdPx?: number
  loop?: boolean
}

/**
 * Minimal, dependency-free swipe/drag + keyboard navigation for carousels.
 * - Pointer/touch drag with threshold
 * - ArrowLeft/ArrowRight keyboard support on focused container
 */
export function useSwipeCarousel({ length, index, setIndex, thresholdPx = 64, loop = true }: UseSwipeCarouselOptions) {
  const startXRef = React.useRef(0)
  const startYRef = React.useRef(0)
  const draggingRef = React.useRef(false)
  const pointerIdRef = React.useRef<number | null>(null)
  const [dragX, setDragX] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)

  const onPointerDown = (e: React.PointerEvent) => {
    ;(e.currentTarget as HTMLElement).focus()
    // Ignore pointer down that originates on interactive descendants so buttons/links work
    const target = e.target as HTMLElement
    if (target.closest('button, [role="button"], a, input, textarea, select, [data-no-swipe]')) {
      return
    }
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
    pointerIdRef.current = e.pointerId
    draggingRef.current = true
    startXRef.current = e.clientX
    startYRef.current = e.clientY
    setIsDragging(true)
    setDragX(0)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return
    setDragX(e.clientX - startXRef.current)
  }

  const goPrev = () => {
    if (length <= 1) return
    if (loop) setIndex((index - 1 + length) % length)
    else setIndex(Math.max(0, index - 1))
  }

  const goNext = () => {
    if (length <= 1) return
    if (loop) setIndex((index + 1) % length)
    else setIndex(Math.min(length - 1, index + 1))
  }

  const finish = (dx: number, dy: number) => {
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)
    // only act on horizontal intent
    if (absX < thresholdPx || absX < absY) return
    if (dx > 0) goPrev()
    else goNext()
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (!draggingRef.current) return
    const dx = e.clientX - startXRef.current
    const dy = e.clientY - startYRef.current
    draggingRef.current = false
    pointerIdRef.current = null
    setIsDragging(false)
    setDragX(0)
    finish(dx, dy)
  }

  const onPointerCancel = () => {
    draggingRef.current = false
    pointerIdRef.current = null
    downAccRef.current = 0
    upAccRef.current = 0
    setIsDragging(false)
    setDragX(0)
  }

  const onPointerLeave = (e: React.PointerEvent) => {
    if (!draggingRef.current) return
    const dx = e.clientX - startXRef.current
    const dy = e.clientY - startYRef.current
    draggingRef.current = false
    pointerIdRef.current = null
    setIsDragging(false)
    setDragX(0)
    finish(dx, dy)
  }

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goPrev()
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      goNext()
    }
  }

  return {
    containerProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onPointerLeave,
      onDragStart: (e: React.DragEvent) => e.preventDefault(),
      onMouseEnter: (e: React.MouseEvent) => (e.currentTarget as HTMLElement).focus(),
      onKeyDown,
      tabIndex: 0,
      role: 'region',
      'aria-roledescription': 'carousel',
      style: { touchAction: 'pan-y', userSelect: 'none' } as React.CSSProperties,
    } as React.HTMLAttributes<HTMLElement>,
    goPrev,
    goNext,
    isDragging,
    dragX,
    thresholdPx,
  }
}


