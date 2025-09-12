"use client"

import { useCompanionPanel } from "@lib/context/companion-panel-context"
import { MessageCircle } from "lucide-react"

const AIChatTriggerButton: React.FC = () => {
  const { isOpen, openPanel, closePanel, goBack, currentPanel, panelHistory } = useCompanionPanel()
  
  // Check if AI assistant panel is currently open
  const isAIOpen = isOpen && currentPanel?.type === 'aiCompanion'

  const handleClick = () => {
    // History-aware behavior: respect the panel history stack
    if (isAIOpen) {
      // AI is currently open - go back if there's history, otherwise close
      if (panelHistory.length > 0) {
        goBack() // Go back to previous panel
      } else {
        closePanel() // No history, close entirely
      }
    } else {
      // AI is not current - open AI panel
      openPanel('aiCompanion')
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`nav-icon-btn`}
      aria-current={isAIOpen ? 'true' : undefined}
      data-testid="ai-chat-button"
      title={
        isAIOpen 
          ? (panelHistory.length > 0 ? 'Go back' : 'Close AI Assistant')
          : 'Open AI Assistant'
      }
    >
      <MessageCircle className="nav-icon" strokeWidth={1.75} aria-hidden />
    </button>
  )
}

export default AIChatTriggerButton