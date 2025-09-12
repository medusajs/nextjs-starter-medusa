"use client"

import { useCompanionPanel } from "@lib/context/companion-panel-context"
import { Book, MessageSquare, Mail, ExternalLink, ArrowLeft, X } from "lucide-react"

const HelpPanelContent: React.FC = () => {
  const { closePanel, goBack, panelHistory } = useCompanionPanel()

  const helpCategories = [
    {
      icon: Book,
      title: "Documentation",
      description: "Browse our comprehensive guides and tutorials",
      action: "View Docs"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      action: "Start Chat"
    },
    {
      icon: Mail,
      title: "Contact Support",
      description: "Send us an email for detailed assistance",
      action: "Send Email"
    }
  ]

  return (
    <>
      {/* Header (compact, no decorative icons) */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
        {/* Left side - Back button (only show if there's history) */}
        {panelHistory.length > 0 && (
          <button
            onClick={() => panelHistory.length > 0 ? goBack() : closePanel()}
            className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors mr-3"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        {/* Center - Title */}
        <div className="flex items-center gap-2 flex-1">
          <h2 className="ty-title text-gray-900">Help Center</h2>
        </div>
        
        {/* Right side - Close button */}
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
          onClick={closePanel}
          data-testid="close-help-button"
          title="Close Help Center"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div className="text-center py-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              How can we help you?
            </h3>
            <p className="text-gray-600">
              Choose from the options below to get the assistance you need
            </p>
          </div>

          <div className="space-y-3">
            {helpCategories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <div
                  key={index}
                  className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 group-hover:bg-blue-100 rounded-lg transition-colors">
                      <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-900">
                        {category.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 mb-3">
                        {category.description}
                      </p>
                      <div className="flex items-center text-sm text-blue-600 group-hover:text-blue-700">
                        <span>{category.action}</span>
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Quick Tips</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Check our FAQ section for common questions</li>
              <li>• Use the search feature to find specific topics</li>
              <li>• Our support team is available 24/7</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default HelpPanelContent