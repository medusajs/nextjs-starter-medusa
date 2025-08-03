"use client"

import React from "react"

/**
 * Demo component showcasing the new content-aware Tailwind responsive system
 * 
 * This component demonstrates how to use:
 * - cxs, csm, cmd, clg, cxl (content-based breakpoints)
 * - panel-open, panel-closed (panel state)
 * - Combined variants like panel-open-cmd
 */

const ContentResponsiveDemo: React.FC = () => {
  return (
    <div className="space-y-8 p-6 bg-gray-50 rounded-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Responsive Content Queries Tailwind Demo
        </h2>
        <p className="text-gray-600">
          These elements respond to content area width, not viewport width!
        </p>
      </div>

      {/* Grid Demo - Shows content-responsive grid columns */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          📊 Content-Responsive Grid
        </h3>
        <div className="
          grid gap-4
          cxs:grid-cols-1 
          csm:grid-cols-2 
          cmd:grid-cols-3 
          clg:grid-cols-4 
          cxl:grid-cols-5
          panel-open-cmd:!grid-cols-2
          panel-open-clg:!grid-cols-3
        ">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="bg-blue-100 border border-blue-200 rounded-lg p-4 text-center"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-blue-800">Item {i + 1}</p>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 bg-white p-3 rounded border">
          <code>
            cxs:grid-cols-1 csm:grid-cols-2 cmd:grid-cols-3 clg:grid-cols-4 cxl:grid-cols-5<br/>
            panel-open-cmd:!grid-cols-2 panel-open-clg:!grid-cols-3
          </code>
          <p className="text-xs text-gray-400 mt-1">
            💡 Using <code>!</code> prefix ensures panel variants override base classes
          </p>
        </div>
      </div>

      {/* Typography Demo - Shows content-responsive text sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          ✍️ Content-Responsive Typography
        </h3>
        <div className="space-y-3">
          <p className="
            cxs:text-sm 
            csm:text-base 
            cmd:text-lg 
            clg:text-xl 
            panel-open:text-sm
            bg-white p-4 rounded border
          ">
            This text gets smaller/larger based on content area width. When the panel opens, it adapts!
          </p>
          <div className="text-xs text-gray-500 bg-white p-3 rounded border">
            <code>
              cxs:text-sm csm:text-base cmd:text-lg clg:text-xl panel-open:text-sm
            </code>
          </div>
        </div>
      </div>

      {/* Visibility Demo - Shows content-responsive visibility */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          👁️ Content-Responsive Visibility
        </h3>
        <div className="space-y-2">
          <div className="cxs:block csm:hidden bg-red-100 border border-red-200 rounded p-3">
            <span className="text-red-800 text-sm font-medium">
              📱 Visible only when content is XS (Less than 640px width)
            </span>
          </div>
          <div className="cxs:hidden csm:block cmd:hidden bg-yellow-100 border border-yellow-200 rounded p-3">
            <span className="text-yellow-800 text-sm font-medium">
              📲 Visible only when content is SM (640px-767px width)
            </span>
          </div>
          <div className="cxs:hidden csm:hidden cmd:block clg:hidden bg-green-100 border border-green-200 rounded p-3">
            <span className="text-green-800 text-sm font-medium">
              💻 Visible only when content is MD (768px-1023px width)
            </span>
          </div>
          <div className="cxs:hidden csm:hidden cmd:hidden clg:block bg-purple-100 border border-purple-200 rounded p-3">
            <span className="text-purple-800 text-sm font-medium">
              🖥️ Visible when content is LG or larger (1024px+ width)
            </span>
          </div>
        </div>
      </div>

      {/* Panel State Demo */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          🎛️ Panel State Awareness
        </h3>
        <div className="space-y-2">
          <div className="
            panel-closed:bg-green-100 panel-closed:border-green-200 
            panel-open:bg-orange-100 panel-open:border-orange-200 
            border rounded p-4 transition-colors
          ">
            <p className="
              panel-closed:text-green-800 
              panel-open:text-orange-800 
              font-medium
            ">
              <span className="panel-closed:inline panel-open:hidden">
                ✅ Panel is closed - I'm green!
              </span>
              <span className="panel-closed:hidden panel-open:inline">
                🟠 Panel is open - I'm orange!
              </span>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Open/close the companion panel to see this change color and text.
            </p>
          </div>
        </div>
      </div>

      {/* Combined Variants Demo */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          🎯 Combined Variants (Advanced)
        </h3>
        <div className="
          grid gap-2 grid-cols-1
          panel-closed-csm:!grid-cols-2
          panel-closed-cmd:!grid-cols-4
          panel-closed-clg:!grid-cols-4
          panel-open-cxs:!grid-cols-1
          panel-open-csm:!grid-cols-1
          panel-open-cmd:!grid-cols-2
          panel-open-clg:!grid-cols-2
        ">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="bg-indigo-100 border border-indigo-200 rounded p-3 text-center"
            >
              <div className="text-indigo-800 text-sm font-medium">
                Advanced {i + 1}
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 bg-white p-3 rounded border">
          <code>
            panel-closed-cmd:!grid-cols-4 panel-open-cmd:!grid-cols-2<br/>
            panel-closed-clg:!grid-cols-4 panel-open-clg:!grid-cols-2
          </code>
          <p className="text-xs text-gray-400 mt-1">
            💡 Combined variants with <code>!</code> for reliable overrides
          </p>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-2">🔍 Debug Info</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div>Current content breakpoint: <span className="
            cxs:inline csm:hidden cmd:hidden clg:hidden cxl:hidden
          ">xs</span><span className="
            cxs:hidden csm:inline cmd:hidden clg:hidden cxl:hidden
          ">sm</span><span className="
            cxs:hidden csm:hidden cmd:inline clg:hidden cxl:hidden
          ">md</span><span className="
            cxs:hidden csm:hidden cmd:hidden clg:inline cxl:hidden
          ">lg</span><span className="
            cxs:hidden csm:hidden cmd:hidden clg:hidden cxl:inline
          ">xl</span></div>
          <div>Panel state: <span className="panel-open:inline panel-closed:hidden">Open</span><span className="panel-open:hidden panel-closed:inline">Closed</span></div>
          <div>Device type: <span className="device-mobile:inline device-desktop:hidden">Mobile</span><span className="device-mobile:hidden device-desktop:inline">Desktop</span></div>
        </div>
      </div>
    </div>
  )
}

export default ContentResponsiveDemo