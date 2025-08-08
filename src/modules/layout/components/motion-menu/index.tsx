"use client"

import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { panelSlidePreset, backdropFadePreset, MotionDurations } from '@lib/motion'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { MenuItem, motionMenuSections, motionDemoItems } from './menu-data'

type MotionMenuRootProps = { items: MenuItem[] }

const columnsVariants = {
  animate: { transition: { staggerChildren: 0.04, delayChildren: 0.06 } },
}
const itemVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: 6, transition: { duration: 0.15 } },
}

export default function MotionMenuRoot({ items }: MotionMenuRootProps) {
  const [openKey, setOpenKey] = React.useState<string | null>(null)
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <nav role="menubar" className="relative h-full flex items-center">
      <ul className="flex items-center gap-6 h-full">
        {/* Primary trigger for the full menu */}
        <li className="h-full flex items-center">
          <button
            role="menuitem"
            aria-expanded={isOpen}
            aria-controls={`panel-menu`}
            className="flex items-center gap-1 hover:text-gray-900 h-full"
            onClick={() => setIsOpen((p) => !p)}
          >
            Menu
            <motion.span
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: MotionDurations.enter.xfast }}
            >▸</motion.span>
          </button>
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div className="fixed inset-0 z-[70]" {...backdropFadePreset()} onClick={() => setIsOpen(false)} />
                <motion.aside
                  id={`panel-menu`}
                  role="menu"
                  className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-[480px] bg-white shadow-xl border-l border-gray-200 z-[71] rounded-l-2xl"
                  {...panelSlidePreset('right')}
                >
                  <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                    <div className="text-base font-medium">Menu</div>
                    <button className="text-gray-500 hover:text-gray-800" onClick={() => setIsOpen(false)}>Close</button>
                  </div>
                  <div className="p-5 flex flex-col gap-6 overflow-y-auto h-[calc(100%-60px)]">
                    {motionMenuSections.map((section) => (
                      <div key={section.title}>
                        <div className="text-sm font-semibold text-gray-800 mb-2">{section.title}</div>
                        <motion.div variants={columnsVariants} initial="initial" animate="animate" exit="exit" className="grid grid-cols-1 gap-1">
                          {section.items.map((c) => (
                            <motion.div key={c.href} variants={itemVariants}>
                              <LocalizedClientLink href={c.href} className="block py-2 px-2 rounded-md hover:bg-gray-50">
                                <div className="text-sm font-medium">{c.title}</div>
                                {c.description && <div className="text-xs text-gray-500 mt-0.5">{c.description}</div>}
                              </LocalizedClientLink>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>
        </li>

        {/* Demo trigger -> full-screen submenu screen */}
        <li className="h-full flex items-center">
          <button
            role="menuitem"
            aria-expanded={openKey === 'demo'}
            aria-controls={`panel-demo`}
            className="flex items-center gap-1 hover:text-gray-900 h-full"
            onClick={() => setOpenKey((k) => (k === 'demo' ? null : 'demo'))}
          >
            Demo
            <motion.span
              animate={{ rotate: openKey === 'demo' ? 90 : 0 }}
              transition={{ duration: MotionDurations.enter.xfast }}
            >▸</motion.span>
          </button>
          <AnimatePresence>
            {openKey === 'demo' && (
              <>
                <motion.div className="fixed inset-0 z-[72]" {...backdropFadePreset()} onClick={() => setOpenKey(null)} />
                <motion.aside
                  id={`panel-demo`}
                  role="menu"
                  className="fixed inset-0 z-[73] bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.2 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                  <div className="max-w-5xl mx-auto p-6">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                      <h2 className="text-lg font-semibold">Demo Submenu</h2>
                      <button className="text-gray-500 hover:text-gray-800" onClick={() => setOpenKey(null)}>Close</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {motionDemoItems.map((c) => (
                        <motion.div key={c.href} variants={itemVariants} initial="initial" animate="animate" exit="exit" className="border rounded-lg p-4 hover:shadow-sm">
                          <LocalizedClientLink href={c.href} className="block">
                            <div className="text-sm font-medium mb-1">{c.title}</div>
                            {c.description && <div className="text-xs text-gray-500">{c.description}</div>}
                          </LocalizedClientLink>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>
        </li>
      </ul>
    </nav>
  )
}


