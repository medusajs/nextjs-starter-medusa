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
      className={`h-full p-2 transition-colors duration-200 ${
        isAIOpen ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      } rounded-md`}
      data-testid="ai-chat-button"
      title={
        isAIOpen 
          ? (panelHistory.length > 0 ? 'Go back' : 'Close AI Assistant')
          : 'Open AI Assistant'
      }
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  )
}

export default AIChatTriggerButton