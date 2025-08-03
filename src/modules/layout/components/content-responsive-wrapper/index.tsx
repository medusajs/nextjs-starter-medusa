"use client"

import React, { useEffect } from 'react'
import { useCompanionPanel } from "@lib/context/companion-panel-context"
import { useContentMediaQuery } from '@lib/hooks/use-content-media-query'

interface ContentResponsiveWrapperProps {
  children: React.ReactNode
  className?: string
}

const ContentResponsiveWrapper: React.FC<ContentResponsiveWrapperProps> = ({ 
  children, 
  className = '' 
}) => {
  const { isOpen, isMobile } = useCompanionPanel()
  const { 
    currentSize, 
    semanticSize, 
    contentWidth, 
    containerRef 
  } = useContentMediaQuery()

  // Update data attributes when size changes
  useEffect(() => {
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
    }
  }, [currentSize, semanticSize, isOpen, isMobile, contentWidth])

  // On mobile, render normally (panels show as overlay)
  if (isMobile) {
    return (
      <div 
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className={className}
        data-media-query={currentSize}
        data-semantic-size={semanticSize}
        data-panel-open={isOpen}
        data-device-mobile="true"
      >
        {children}
      </div>
    )
  }

  // On desktop/tablet, compress main content when any panel is open
  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={`transition-all duration-300 ease-in-out ${
        isOpen 
          ? "md:mr-96 lg:mr-[400px]" // Make space for companion panel
          : "mr-0"
      } ${className}`}
      data-media-query={currentSize}
      data-semantic-size={semanticSize}
      data-panel-open={isOpen}
      data-device-mobile="false"
      style={{
        '--content-width': `${contentWidth}px`
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

export default ContentResponsiveWrapper