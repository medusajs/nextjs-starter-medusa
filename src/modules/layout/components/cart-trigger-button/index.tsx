"use client"

import { useCompanionPanel } from "@lib/context/companion-panel-context"
import { ShoppingBag } from "lucide-react"

interface CartTriggerButtonProps {
  totalItems: number
}

const CartTriggerButton: React.FC<CartTriggerButtonProps> = ({ totalItems }) => {
  const { isOpen, toggleCartPanel, currentPanel } = useCompanionPanel()
  
  // Check if cart panel is currently open
  const isCartOpen = isOpen && currentPanel?.type === 'cart'

  return (
    <button
      onClick={toggleCartPanel}
      className={`h-full transition-colors duration-200 ${
        isCartOpen ? 'text-blue-600' : 'hover:text-ui-fg-base'
      }`}
      data-testid="cart-button"
    >
      <div className="flex flex-row items-center gap-x-2">
        <ShoppingBag className="w-6 h-6" /> {totalItems}
      </div>
    </button>
  )
}

export default CartTriggerButton