"use client"

import React from 'react'
import { MotionDurations, MotionEasings } from '@lib/motion'
import { useCompanionPanel } from "@lib/context/companion-panel-context"
import { useLeftPanel } from "@lib/context/left-panel-context"
import { useContentMediaQuery } from '@lib/hooks/use-content-media-query'

interface UnifiedLayoutWrapperProps {
  children: React.ReactNode
  footer: React.ReactNode
  className?: string
}

/**
 * Unified Layout Wrapper that manages both content AND footer compression
 * with custom media query data attributes based on actual content area width
 */
const UnifiedLayoutWrapper: React.FC<UnifiedLayoutWrapperProps> = ({ 
  children, 
  footer,
  className = '' 
}) => {
  const { isOpen, isMobile, panelWidth } = useCompanionPanel()
  const left = useLeftPanel()
  const { 
    currentSize, 
    semanticSize, 
    contentWidth, 
    containerRef,
    isAtLeast 
  } = useContentMediaQuery()

  // Update data attributes when size changes
  React.useEffect(() => {
    if (containerRef.current) {
      // Set size-based data attribute (xs/sm/md/lg/xl)
      containerRef.current.setAttribute('data-media-query', currentSize)
      
      // Set semantic data attribute (mobile/tablet/desktop)
      containerRef.current.setAttribute('data-semantic-size', semanticSize)
      
      // Set companion panel state for CSS
      containerRef.current.setAttribute('data-panel-open', isOpen.toString())
      containerRef.current.setAttribute('data-device-mobile', isMobile.toString())
      
      // Set actual width for advanced CSS (if needed)  
      containerRef.current.style.setProperty('--content-width', `${contentWidth}px`)
      containerRef.current.style.setProperty('--panel-width', `${panelWidth}px`)
    }
  }, [currentSize, semanticSize, isOpen, isMobile, contentWidth, isAtLeast, panelWidth])

  // On mobile, render normally (panels show as overlay)
  if (isMobile) {
    return (
      <div 
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className={`min-h-screen flex flex-col ${className}`}
        data-media-query={currentSize}
        data-semantic-size={semanticSize}
        data-panel-open={isOpen}
        data-device-mobile="true"
        style={{
          '--content-width': `${contentWidth}px`
        } as React.CSSProperties}
      >
        {/* Main content area */}
        <main className="flex-1">
          {children}
        </main>
        
        {/* Footer - full width on mobile */}
        <footer>
          {footer}
        </footer>
      </div>
    )
  }

  // On desktop/tablet, compress BOTH content AND footer when panel is open
  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={`min-h-screen flex flex-col ${className}`}
      data-media-query={currentSize}
      data-semantic-size={semanticSize}
      data-panel-open={isOpen}
      data-device-mobile="false"
      style={{
        '--content-width': `${contentWidth}px`,
        '--panel-width': `${panelWidth}px`,
        marginRight: isOpen ? `${panelWidth}px` : '0px',
        marginLeft: left.isOpen && !left.isMobile ? `${left.width}px` : '0px',
        transition: `margin-right ${
          (isOpen ? MotionDurations.enter.base : MotionDurations.exit.fast) * 1000
        }ms ${
          isOpen ? `cubic-bezier(${MotionEasings.enter.standard.join(',')})` : `cubic-bezier(${MotionEasings.exit.standard.join(',')})`
        }, margin-left ${
          ((left.isOpen && !left.isMobile) ? MotionDurations.enter.base : MotionDurations.exit.fast) * 1000
        }ms ${
          left.isOpen && !left.isMobile ? `cubic-bezier(${MotionEasings.enter.standard.join(',')})` : `cubic-bezier(${MotionEasings.exit.standard.join(',')})`
        }`
      } as React.CSSProperties}
    >
      {/* Main content area */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer - compressed with content on desktop */}
      <footer>
        {footer}
      </footer>
    </div>
  )
}

export default UnifiedLayoutWrapper