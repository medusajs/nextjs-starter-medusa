"use client"

import { useCompanionPanel } from "@lib/context/companion-panel-context"
import { HelpCircle } from "lucide-react"

const HelpTriggerButton: React.FC = () => {
  const { isOpen, openPanel, closePanel, goBack, currentPanel, panelHistory } = useCompanionPanel()
  
  // Check if help panel is currently open
  const isHelpOpen = isOpen && currentPanel?.type === 'helpCompanion'

  const handleClick = () => {
    // History-aware behavior: respect the panel history stack
    if (isHelpOpen) {
      // Help is currently open - go back if there's history, otherwise close
      if (panelHistory.length > 0) {
        goBack() // Go back to previous panel
      } else {
        closePanel() // No history, close entirely
      }
    } else {
      // Help is not current - open help panel
      openPanel('helpCompanion')
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`h-full p-2 transition-colors duration-200 ${
        isHelpOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      } rounded-md`}
      data-testid="help-button"
      title={
        isHelpOpen 
          ? (panelHistory.length > 0 ? 'Go back' : 'Close Help')
          : 'Get Help'
      }
    >
      <HelpCircle className="w-6 h-6" />
    </button>
  )
}

export default HelpTriggerButton