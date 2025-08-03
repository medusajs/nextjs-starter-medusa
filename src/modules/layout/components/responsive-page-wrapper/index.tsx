"use client"

import React from "react"
import { useCompanionPanel } from "@lib/context/companion-panel-context"

interface ResponsivePageWrapperProps {
  children: React.ReactNode
}

const ResponsivePageWrapper: React.FC<ResponsivePageWrapperProps> = ({ children }) => {
  const { isOpen, isMobile } = useCompanionPanel()

  // On mobile, render normally (panels show as overlay)
  if (isMobile) {
    return <>{children}</>
  }

  // On desktop/tablet, compress main content when any panel is open
  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isOpen 
          ? "md:mr-96 lg:mr-[400px]" // Make space for companion panel
          : "mr-0"
      }`}
    >
      {children}
    </div>
  )
}

export default ResponsivePageWrapper