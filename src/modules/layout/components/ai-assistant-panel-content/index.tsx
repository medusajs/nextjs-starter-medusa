"use client"

import { useCompanionPanel } from "@lib/context/companion-panel-context"
import { MessageCircle, Sparkles, Zap, Users, Send } from "lucide-react"
import { useState } from "react"

const AIAssistantPanelContent: React.FC = () => {
  const { closePanel } = useCompanionPanel()
  const [message, setMessage] = useState("")

  const features = [
    {
      icon: Sparkles,
      title: "Product Recommendations",
      description: "Get personalized suggestions based on your preferences"
    },
    {
      icon: Zap,
      title: "Instant Answers",
      description: "Quick responses to your questions about orders and products"
    },
    {
      icon: Users,
      title: "Expert Assistance",
      description: "Connect with our knowledgeable support team"
    }
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      // Placeholder for sending message
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <MessageCircle className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              AI Assistant
            </h2>
            <p className="text-sm text-gray-500">Always here to help</p>
          </div>
        </div>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-500"
          onClick={closePanel}
          data-testid="close-ai-button"
        >
          <span className="sr-only">Close</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Welcome Message */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                👋 Hi there! I'm your AI assistant
              </h3>
              <p className="text-sm text-gray-600">
                I can help you find products, track orders, and answer questions about our store. What would you like to know?
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="p-4 space-y-3">
          <h4 className="font-medium text-gray-900 mb-3">What I can help with:</h4>
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="p-1.5 bg-white rounded-md">
                  <IconComponent className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 text-sm">
                    {feature.title}
                  </h5>
                  <p className="text-xs text-gray-600 mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Sample Questions */}
        <div className="p-4 border-t border-gray-100">
          <h4 className="font-medium text-gray-900 mb-3 text-sm">Try asking:</h4>
          <div className="space-y-2">
            {[
              "What's new in your store?",
              "Help me find a gift for someone",
              "What's the status of my order?",
              "Do you have any deals today?"
            ].map((question, index) => (
              <button
                key={index}
                className="block w-full text-left p-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-md hover:border-purple-300 hover:text-purple-700 transition-colors"
                onClick={() => setMessage(question)}
              >
                "{question}"
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            This is a demo interface. Full AI chat coming soon! 🚀
          </p>
        </div>
      </div>
    </>
  )
}

export default AIAssistantPanelContent