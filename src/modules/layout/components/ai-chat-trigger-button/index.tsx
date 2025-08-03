"use client"

import { useCompanionPanel } from "@lib/context/companion-panel-context"
import { MessageCircle } from "lucide-react"

const AIChatTriggerButton: React.FC = () => {
  const { isOpen, openPanel, closePanel, currentPanel } = useCompanionPanel()
  
  // Check if AI assistant panel is currently open
  const isAIOpen = isOpen && currentPanel?.type === 'ai-assistant'

  const handleClick = () => {
    if (isAIOpen) {
      closePanel()
    } else {
      openPanel('ai-assistant')
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`h-full p-2 transition-colors duration-200 ${
        isAIOpen ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      } rounded-md`}
      data-testid="ai-chat-button"
      title={isAIOpen ? "Close AI Assistant" : "Open AI Assistant"}
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  )
}

export default AIChatTriggerButton