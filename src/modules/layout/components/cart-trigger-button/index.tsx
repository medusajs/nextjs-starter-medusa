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
      className={`nav-icon-btn`}
      aria-current={isCartOpen ? 'true' : undefined}
      data-testid="cart-button"
      title={
        isCartOpen 
          ? (panelHistory.length > 0 ? 'Go back' : 'Close cart')
          : 'Open cart'
      }
    >
      <div className="relative w-8 h-8 grid place-items-center">
        <ShoppingBag className="nav-icon" strokeWidth={1.75} aria-hidden />
        {totalItems > 0 && (
          <span className="nav-badge" aria-label={`${totalItems} items in cart`}>{totalItems}</span>
        )}
      </div>
    </button>
  )
}

export default CartTriggerButton