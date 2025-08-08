"use client"

import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { panelSlidePreset, backdropFadePreset, modalScaleFadePreset, popoverSlidePreset } from "@lib/motion"

export default function MotionDemoPage() {
  const [showPanel, setShowPanel] = React.useState(false)
  const [showModal, setShowModal] = React.useState(false)
  const [showPopover, setShowPopover] = React.useState(false)

  const codePanel = React.useMemo(
    () => String.raw`import { AnimatePresence, motion } from 'framer-motion'
import { panelSlidePreset, backdropFadePreset } from '@lib/motion'

function Example() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>Open Panel</button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0" {...backdropFadePreset()} onClick={() => setOpen(false)} />
            <motion.aside className="fixed right-0 top-0 h-full w-[380px] bg-white" {...panelSlidePreset('right')}>
              ...
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}`,
    []
  )

  const codeModal = React.useMemo(
    () => String.raw`import { AnimatePresence, motion } from 'framer-motion'
import { modalScaleFadePreset, backdropFadePreset } from '@lib/motion'

function ExampleModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0" {...backdropFadePreset()} onClick={onClose} />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div {...modalScaleFadePreset()}>
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-xl w-full">
                ...
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}`,
    []
  )

  const codePopover = React.useMemo(
    () => String.raw`import { AnimatePresence, motion } from 'framer-motion'
import { popoverSlidePreset } from '@lib/motion'

function ExamplePopover() {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen((s) => !s)}>Toggle</button>
      <AnimatePresence>
        {open && (
          <motion.div className="absolute left-0 mt-2 w-56 rounded-md border bg-white shadow-lg" {...popoverSlidePreset('down')}>
            ...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}`,
    []
  )

  return (
    <div className="content-container py-8">
      <h1 className="text-2xl font-semibold mb-6">Motion Presets Demo</h1>

      {/* Panel Demo */}
      <section className="mb-10">
        <h2 className="text-lg font-medium mb-2">Panel Slide (Right)</h2>
        <p className="text-sm text-gray-600 mb-4">Uses shared tokens with presence and backdrop.</p>
        <button
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => setShowPanel(true)}
        >
          Open Panel
        </button>

        <div className="mt-4 rounded-md border bg-gray-50">
          <div className="px-3 py-2 text-xs font-medium text-gray-700 border-b">Code</div>
          <pre className="overflow-auto p-3 text-xs text-gray-800"><code>{codePanel}</code></pre>
        </div>

        <AnimatePresence>
          {showPanel && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 z-[80] bg-gray-900/50 backdrop-blur-md"
                {...backdropFadePreset()}
                onClick={() => setShowPanel(false)}
              />
              {/* Panel */}
              <motion.aside
                className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-[380px] bg-white shadow-xl border-l border-gray-200 z-[81] rounded-l-2xl"
                {...panelSlidePreset('right')}
              >
                <div className="p-4 flex items-center justify-between border-b border-gray-200">
                  <h3 className="text-base font-medium">Demo Panel</h3>
                  <button className="text-gray-500 hover:text-gray-800" onClick={() => setShowPanel(false)}>Close</button>
                </div>
                <div className="p-4 text-sm text-gray-700">
                  Panel content goes here. This demo mirrors the app panel behavior.
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </section>

      {/* Modal Demo */}
      <section className="mb-10">
        <h2 className="text-lg font-medium mb-2">Modal Scale + Fade</h2>
        <p className="text-sm text-gray-600 mb-4">Shared tokens with scale+fade preset.</p>
        <button
          className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
          onClick={() => setShowModal(true)}
        >
          Open Modal
        </button>

        <div className="mt-4 rounded-md border bg-gray-50">
          <div className="px-3 py-2 text-xs font-medium text-gray-700 border-b">Code</div>
          <pre className="overflow-auto p-3 text-xs text-gray-800"><code>{codeModal}</code></pre>
        </div>

        <AnimatePresence>
          {showModal && (
            <>
              <motion.div
                className="fixed inset-0 z-[80] bg-gray-900/60 backdrop-blur-md"
                {...backdropFadePreset()}
                onClick={() => setShowModal(false)}
              />
              <div className="fixed inset-0 z-[81] flex items-center justify-center p-4">
                <motion.div {...modalScaleFadePreset()}>
                  <div className="bg-white rounded-lg shadow-xl border max-w-xl w-full p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-medium">Demo Modal</h3>
                      <button className="text-gray-500 hover:text-gray-800" onClick={() => setShowModal(false)}>Close</button>
                    </div>
                    <p className="text-sm text-gray-700">This modal uses the shared modal preset.</p>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </section>

      {/* Popover Demo */}
      <section className="mb-10">
        <h2 className="text-lg font-medium mb-2">Popover Slide (Down) + Fade</h2>
        <p className="text-sm text-gray-600 mb-4">Small-distance y-axis slide with fade.</p>
        <div className="relative inline-block">
          <button
            className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-black"
            onClick={() => setShowPopover((s) => !s)}
          >
            Toggle Popover
          </button>
          <div className="mt-4 rounded-md border bg-gray-50">
            <div className="px-3 py-2 text-xs font-medium text-gray-700 border-b">Code</div>
            <pre className="overflow-auto p-3 text-xs text-gray-800"><code>{codePopover}</code></pre>
          </div>
          <AnimatePresence>
            {showPopover && (
              <motion.div
                className="absolute left-0 mt-2 z-[82] w-56 rounded-md border bg-white shadow-lg"
                {...popoverSlidePreset('down')}
              >
                <div className="p-3 text-sm text-gray-700">
                  This is a popover using the popover preset.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}


