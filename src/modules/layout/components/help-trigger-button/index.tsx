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
      className={`nav-icon-btn`}
      aria-current={isHelpOpen ? 'true' : undefined}
      data-testid="help-button"
      title={
        isHelpOpen 
          ? (panelHistory.length > 0 ? 'Go back' : 'Close Help')
          : 'Get Help'
      }
    >
      <HelpCircle className="nav-icon" strokeWidth={1.75} aria-hidden />
    </button>
  )
}

export default HelpTriggerButton