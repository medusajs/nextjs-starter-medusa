"use client"

import { HttpTypes } from "@medusajs/types"
import CartTriggerButton from "../cart-trigger-button"
import CartAutoOpen from "../cart-auto-open"

interface CartDrawerProps {
    cart?: HttpTypes.StoreCart | null
    autoOpenOnMobile?: boolean  // Control auto-open behavior on mobile
    autoOpenDuration?: number   // How long to keep cart open (ms)
    disabled?: boolean          // Completely disable auto-open
}

/**
 * CartDrawer - Legacy wrapper component
 * 
 * This component combines the cart trigger button with auto-open functionality.
 * For new implementations, use CartTriggerButton + CartAutoOpen directly.
 */
const CartDrawer = ({
    cart: cartState,
    autoOpenOnMobile = false,     // Default: disabled on mobile
    autoOpenDuration = 4000,      // Default: 4 seconds
    disabled = false,             // Default: enabled
}: CartDrawerProps) => {
    const totalItems =
        cartState?.items?.reduce((acc, item) => {
            return acc + item.quantity
        }, 0) || 0

    return (
        <>
            <CartTriggerButton totalItems={totalItems} />
            <CartAutoOpen 
                cart={cartState}
                autoOpenOnMobile={autoOpenOnMobile}
                autoOpenDuration={autoOpenDuration}
                disabled={disabled}
            />
        </>
    )
}

export default CartDrawer