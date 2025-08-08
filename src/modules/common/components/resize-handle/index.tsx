    "use client"

import React from 'react'
import clsx from 'clsx'

export type ResizeHandleSide = 'left' | 'right' | 'top' | 'bottom'

export interface ResizeHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  side: ResizeHandleSide
  isResizing?: boolean
}

const INDICATOR_LENGTH_CLASS = 'h-8'

const ResizeHandle = React.forwardRef<HTMLDivElement, ResizeHandleProps>(
  ({ side, isResizing = false, className, ...rest }, ref) => {
    const isHorizontal = side === 'left' || side === 'right'

    // Container (8px hit target), transparent on hover (indicator changes color)
    const containerClass = clsx(
      'absolute group z-10 transition-colors select-none',
      isHorizontal ? 'cursor-col-resize top-0 bottom-0' : 'cursor-row-resize left-0 right-0',
      // Position by side
      side === 'left' && 'left-0',
      side === 'right' && 'right-0',
      side === 'top' && 'top-0',
      side === 'bottom' && 'bottom-0',
      className,
    )

    const containerStyle: React.CSSProperties = isHorizontal
      ? { width: 8 } // 8px hit target
      : { height: 8 }

    // Indicator: 1px visual line placed on the edge, becomes blue on hover / active
    const indicatorClass = clsx(
      'absolute transition-opacity',
      isHorizontal ? 'w-[3px] ' + INDICATOR_LENGTH_CLASS + ' top-1/2 -translate-y-1/2' : 'h-px w-8 left-1/2 -translate-x-1/2',
      // Edge anchoring and rounding
      side === 'left' && 'left-0 rounded-r',
      side === 'right' && 'right-0 rounded-l',
      side === 'top' && 'top-0 rounded-b',
      side === 'bottom' && 'bottom-0 rounded-t',
    )

    // Indicator color (gray default, blue on hover, blue-500 when actively resizing)
    const indicatorStyle: React.CSSProperties = {
      backgroundColor: '#d1d5db'
    }

    return (
      <div ref={ref} className={containerClass} style={containerStyle} {...rest}>
        <div className={`${indicatorClass} bg-gray-300`} />
      </div>
    )
  }
)

ResizeHandle.displayName = 'ResizeHandle'

export default ResizeHandle


