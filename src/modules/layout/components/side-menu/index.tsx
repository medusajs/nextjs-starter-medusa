"use client"

import { ArrowRightMini, XMark } from "@medusajs/icons"
import { PanelLeft, ChevronRight } from "lucide-react"
import { Text, clx, useToggleState } from "@medusajs/ui"
import React from "react"
import { AnimatePresence, motion } from "framer-motion"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"
import { backdropFadePreset, panelSlidePreset, MotionDurations } from "@lib/motion"
import { useLeftPanel } from "@lib/context/left-panel-context"

const SideMenuItems = {
  Home: "/",
  "Content Aware Demo": "/content-aware",
  "Motion Presets": "/motion",
  Store: "/store",
  Account: "/account",
  Cart: "/cart",
}

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const toggleState = useToggleState()
  const { isOpen, toggle } = useLeftPanel()

  const rootItems: Array<{ label: string; href?: string; action?: () => void }> = [
    { label: 'Home', href: '/' },
    { label: 'Store', href: '/store' },
    { label: 'Demos', action: () => setView('demos') },
    { label: 'Account', href: '/account' },
    { label: 'Cart', href: '/cart' },
  ]

  const demoItems: Array<{ label: string; href: string }> = [
    { label: 'Content Media Queries', href: '/content-aware' },
    { label: 'Motion Presets', href: '/motion' },
  ]

  const closeAll = () => {
    setIsOpen(false)
    setTimeout(() => setView('root'), MotionDurations.exit.fast * 1000)
  }

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <button
          data-testid="nav-menu-button"
          className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base"
          onClick={toggle}
          aria-expanded={isOpen}
          aria-controls="left-companion-panel"
        >
          <PanelLeft className="w-5 h-5 mr-2" />
          Menu
        </button>

      </div>
    </div>
  )
}

export default SideMenu
