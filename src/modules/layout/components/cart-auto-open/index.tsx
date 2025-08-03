"use client"

import { HttpTypes } from "@medusajs/types"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useCompanionPanel } from "@lib/context/companion-panel-context"

interface CartAutoOpenProps {
    cart?: HttpTypes.StoreCart | null
    autoOpenOnMobile?: boolean  // Control auto-open behavior on mobile
    autoOpenDuration?: number   // How long to keep cart open (ms)
    disabled?: boolean          // Completely disable auto-open
}

/**
 * CartAutoOpen - Handles automatic cart opening when items are added
 * 
 * This component monitors cart changes and automatically opens the cart panel
 * when items are added, with responsive awareness and configuration options.
 */
const CartAutoOpen: React.FC<CartAutoOpenProps> = ({
    cart: cartState,
    autoOpenOnMobile = false,     // Default: disabled on mobile for better UX
    autoOpenDuration = 4000,      // Default: 4 seconds (shorter than before)
    disabled = false,             // Allow complete disable
}) => {
    const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(undefined)
    const [autoOpened, setAutoOpened] = useState<boolean>(false) // Track if we auto-opened
    const { openPanel, closePanel, isMobile, isOpen, currentPanel } = useCompanionPanel()
    const pathname = usePathname()

    const totalItems =
        cartState?.items?.reduce((acc, item) => {
            return acc + item.quantity
        }, 0) || 0

    const itemRef = useRef<number>(totalItems || 0)



    const timedOpen = () => {
        // Don't auto-open if disabled
        if (disabled) {
            console.log('CartAutoOpen: Auto-open disabled')
            return
        }
        
        // Don't auto-open if we're on the cart page
        if (pathname.includes("/cart")) {
            console.log('CartAutoOpen: On cart page, skipping auto-open')
            return
        }
        
        // Don't auto-open on mobile unless explicitly enabled
        if (isMobile && !autoOpenOnMobile) {
            console.log('CartAutoOpen: Mobile device and autoOpenOnMobile is false')
            return
        }
        
        // Clear any existing timer first
        if (activeTimer) {
            console.log('CartAutoOpen: Clearing existing timer')
            clearTimeout(activeTimer)
        }
        
        console.log(`CartAutoOpen: Opening cart with ${totalItems} items for ${autoOpenDuration}ms`)
        openPanel('cart', cartState, `Cart (${totalItems})`)
        setAutoOpened(true) // Mark that we auto-opened
        
        const timer = setTimeout(() => {
            console.log('CartAutoOpen: Auto-closing cart after timer')
            closePanel()
            setAutoOpened(false) // Reset flag when we auto-close
        }, autoOpenDuration)
        setActiveTimer(timer)
    }

    /**
     * Monitor cart changes and auto-open when items are added
     */
    useEffect(() => {
        // Only trigger if items were added (totalItems increased)
        // Also check that we're not initializing (both values are 0)
        if (itemRef.current < totalItems && itemRef.current >= 0) {
            console.log(`CartAutoOpen: Items added - was ${itemRef.current}, now ${totalItems}`)
            timedOpen()
        }
        itemRef.current = totalItems
        // Only depend on totalItems to avoid clearing timers on state changes
    }, [totalItems])

    /**
     * Clean up timer when component unmounts
     */
    useEffect(() => {
        return () => {
            if (activeTimer) {
                clearTimeout(activeTimer)
                setActiveTimer(undefined)
            }
        }
    }, [activeTimer])

    /**
     * Clear timer if user manually opens cart (not auto-opened)
     */
    useEffect(() => {
        if (isOpen && currentPanel?.type === 'cart' && !autoOpened && activeTimer) {
            // User opened cart manually, clear auto-close timer
            console.log('CartAutoOpen: User manually opened cart, clearing timer')
            clearTimeout(activeTimer)
            setActiveTimer(undefined)
        }
        
        // Reset autoOpened flag when cart is closed
        if (!isOpen && autoOpened) {
            console.log('CartAutoOpen: Cart closed, resetting autoOpened flag')
            setAutoOpened(false)
        }
    }, [isOpen, currentPanel?.type, autoOpened, activeTimer])

    // This component doesn't render anything - it's just for side effects
    return null
}

export default CartAutoOpen