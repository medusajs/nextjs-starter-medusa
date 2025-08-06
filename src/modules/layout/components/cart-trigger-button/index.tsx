"use client"

import { useCompanionPanel } from "@lib/context/companion-panel-context"
import { ShoppingBag } from "lucide-react"

interface CartTriggerButtonProps {
  totalItems: number
}

const CartTriggerButton: React.FC<CartTriggerButtonProps> = ({ totalItems }) => {
  const { isOpen, openPanel, closePanel, goBack, currentPanel, panelHistory } = useCompanionPanel()
  
  // Check if cart panel is currently open
  const isCartOpen = isOpen && currentPanel?.type === 'cart'

  const handleClick = () => {
    // History-aware behavior: respect the panel history stack
    if (isCartOpen) {
      // Cart is currently open - go back if there's history, otherwise close
      if (panelHistory.length > 0) {
        goBack() // Go back to previous panel
      } else {
        closePanel() // No history, close entirely
      }
    } else {
      // Cart is not current - open cart panel
      openPanel('cart')
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`h-full transition-colors duration-200 ${
        isCartOpen ? 'text-blue-600' : 'hover:text-ui-fg-base'
      }`}
      data-testid="cart-button"
      title={
        isCartOpen 
          ? (panelHistory.length > 0 ? 'Go back' : 'Close cart')
          : 'Open cart'
      }
    >
      <div className="flex flex-row items-center gap-x-2">
        <ShoppingBag className="w-6 h-6" /> {totalItems}
      </div>
    </button>
  )
}

export default CartTriggerButton