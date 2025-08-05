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
    const [previousPanelState, setPreviousPanelState] = useState<{
        wasOpen: boolean
        panelType: string | null
        panelData: any
        panelTitle: string | null
    } | null>(null) // Save previous state before auto-opening
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
        console.log('CartAutoOpen: Current state before save:', { isOpen, currentPanel: currentPanel?.type, title: currentPanel?.title })
        
        // Save current panel state before auto-opening cart
        const stateToSave = {
            wasOpen: isOpen,
            panelType: currentPanel?.type || null,
            panelData: currentPanel?.data || null,
            panelTitle: currentPanel?.title || null
        }
        console.log('CartAutoOpen: Saving state:', stateToSave)
        setPreviousPanelState(stateToSave)
        
        openPanel('cart', cartState, `Cart (${totalItems})`)
        setAutoOpened(true) // Mark that we auto-opened
        
        // Capture the state in the closure to avoid stale state issues
        const capturedState = stateToSave
        
        const timer = setTimeout(() => {
            console.log('CartAutoOpen: Timer triggered - restoring previous panel state')
            console.log('CartAutoOpen: capturedState at timer:', capturedState)
            
            if (capturedState?.wasOpen && capturedState.panelType) {
                // Restore previous panel
                console.log(`CartAutoOpen: Restoring ${capturedState.panelType} panel with data:`, capturedState.panelData)
                openPanel(
                    capturedState.panelType as any,
                    capturedState.panelData,
                    capturedState.panelTitle || undefined
                )
            } else {
                // Nothing was open before, close entirely
                console.log('CartAutoOpen: Nothing was open before, closing panel')
                console.log('CartAutoOpen: Debug - wasOpen:', capturedState?.wasOpen, 'panelType:', capturedState?.panelType)
                closePanel()
            }
            
            setAutoOpened(false) // Reset flag when we auto-close
            setPreviousPanelState(null) // Clear saved state
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
            // Clear saved state on unmount
            setPreviousPanelState(null)
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
            setPreviousPanelState(null) // Clear saved state since user took manual action
        }
        
        // If user switches to a different panel while auto-cart timer is running, clear saved state
        if (isOpen && currentPanel?.type !== 'cart' && autoOpened && activeTimer) {
            console.log('CartAutoOpen: User switched to different panel, clearing saved state')
            clearTimeout(activeTimer)
            setActiveTimer(undefined)
            setAutoOpened(false)
            setPreviousPanelState(null)
        }
        
        // Reset autoOpened flag when cart is closed
        if (!isOpen && autoOpened) {
            console.log('CartAutoOpen: Cart closed, resetting autoOpened flag')
            setAutoOpened(false)
            setPreviousPanelState(null) // Clear saved state when panel closes
        }
    }, [isOpen, currentPanel?.type, autoOpened, activeTimer])

    // This component doesn't render anything - it's just for side effects
    return null
}

export default CartAutoOpen