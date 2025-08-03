"use client"

import { useCompanionPanel } from "@lib/context/companion-panel-context"
import { HelpCircle } from "lucide-react"

const HelpTriggerButton: React.FC = () => {
  const { isOpen, openPanel, closePanel, currentPanel } = useCompanionPanel()
  
  // Check if help panel is currently open
  const isHelpOpen = isOpen && currentPanel?.type === 'help'

  const handleClick = () => {
    if (isHelpOpen) {
      closePanel()
    } else {
      openPanel('help')
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`h-full p-2 transition-colors duration-200 ${
        isHelpOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      } rounded-md`}
      data-testid="help-button"
      title={isHelpOpen ? "Close Help" : "Get Help"}
    >
      <HelpCircle className="w-6 h-6" />
    </button>
  )
}

export default HelpTriggerButton