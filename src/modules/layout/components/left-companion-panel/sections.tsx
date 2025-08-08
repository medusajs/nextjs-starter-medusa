"use client"

import React from 'react'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import CountrySelect from '@modules/layout/components/country-select'
import { Text, useToggleState } from '@medusajs/ui'
import { HttpTypes } from '@medusajs/types'

export function LeftPanelSectionMenu({ regions }: { regions: HttpTypes.StoreRegion[] | null }) {
  const toggleState = useToggleState()
  const [view, setView] = React.useState<'root' | 'demos'>('root')
  const items: Array<{ label: string; href?: string; submenu?: Array<{ label: string; href: string }> }> = [
    { label: 'Home', href: '/' },
    { label: 'Store', href: '/store' },
    {
      label: 'Demos',
      submenu: [
        { label: 'Content Media Queries', href: '/content-aware' },
        { label: 'Motion Presets', href: '/motion' },
      ],
    },
    { label: 'Account', href: '/account' },
    { label: 'Cart', href: '/cart' },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 relative h-full">
        <AnimatePresence initial={false} mode="wait">
          {view === 'root' ? (
            <motion.div key="root" initial={{ x: 0 }} animate={{ x: 0 }} exit={{ x: '-100%', transition: { duration: 0.18 } }}>
              <ul className="flex flex-col gap-1">
                {items.map((i) => (
                  <li key={i.label}>
                    {i.submenu ? (
                      <button
                        className="w-full flex items-center justify-between text-3xl leading-10 px-2 py-1 rounded-md hover:text-ui-fg-disabled"
                        onClick={() => setView('demos')}
                      >
                        <span>{i.label}</span>
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    ) : (
                      <LocalizedClientLink
                        href={i.href!}
                        className="block text-3xl leading-10 px-2 py-1 rounded-md hover:text-ui-fg-disabled"
                      >
                        {i.label}
                      </LocalizedClientLink>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.div key="demos" initial={{ x: '100%' }} animate={{ x: 0, transition: { duration: 0.22 } }} exit={{ x: '100%', transition: { duration: 0.18 } }} className="h-full">
              <div className="flex items-center gap-2 mb-3">
                <button className="text-gray-600 hover:text-gray-900" onClick={() => setView('root')} aria-label="Back">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="text-base font-medium">Demos</div>
              </div>
              <ul className="flex flex-col gap-1">
                {items.find((i) => i.label === 'Demos')!.submenu!.map((s) => (
                  <li key={s.href}>
                    <LocalizedClientLink href={s.href} className="block text-xl px-2 py-2 rounded-md hover:bg-gray-50">
                      {s.label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-auto p-4 border-t border-gray-200 flex flex-col gap-y-4">
        <div
          className="flex justify-between"
          onMouseEnter={toggleState.open}
          onMouseLeave={toggleState.close}
        >
          {regions && (
            <CountrySelect toggleState={toggleState} regions={regions} />
          )}
        </div>
        <Text className="flex justify-between txt-compact-small">
          © {new Date().getFullYear()} Medusa Store. All rights reserved.
        </Text>
      </div>
    </div>
  )
}


