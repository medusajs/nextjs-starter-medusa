import ContentResponsiveDemo from "@modules/layout/components/content-responsive-demo"
import ContentMediaDemo from "@modules/layout/components/content-media-demo"
import ContentResponsiveWrapper from "@modules/layout/components/content-responsive-wrapper"

export default function ContentAware() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="content-container space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Content-Aware Responsive System
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-8">
            Explore our revolutionary responsive system that adapts to content area width, 
            not just viewport width. Perfect for layouts with sidebars, companion panels, 
            and dynamic content compression.
          </p>
        </div>

        {/* Tailwind-based Demo */}
        <ContentResponsiveDemo />

        {/* Wrapper Demo */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🎁 ContentResponsiveWrapper Demo
          </h2>
          <p className="text-gray-600 mb-6">
            This section demonstrates how the ContentResponsiveWrapper automatically 
            applies data attributes and handles panel state integration:
          </p>
          
          <ContentResponsiveWrapper className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                📦 Wrapped Content
              </h3>
              <p className="text-gray-600">
                This content is inside a ContentResponsiveWrapper, which automatically:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Measures content area width with ResizeObserver</li>
                <li>Sets data-media-query attributes (xs, sm, md, lg, xl)</li>
                <li>Sets data-semantic-size attributes (mobile, tablet, desktop)</li>
                <li>Sets data-panel-open and data-device-mobile attributes</li>
                <li>Handles margin compression on desktop when panels open</li>
              </ul>
              
              {/* Demo grid inside wrapper */}
              <div className="
                mt-4 grid gap-3
                cxs:grid-cols-1 
                csm:grid-cols-2 
                cmd:grid-cols-3 
                panel-open-cmd:!grid-cols-2
              ">
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    className="bg-white/80 border border-purple-200 rounded p-3 text-center text-sm"
                  >
                    Wrapped Item {i + 1}
                  </div>
                ))}
              </div>
              
              {/* Show current data attributes */}
              <div className="bg-white/60 rounded p-3 text-xs font-mono">
                <div className="font-semibold text-gray-700 mb-2">Current Data Attributes:</div>
                <div className="space-y-1 text-gray-600">
                  <div>data-media-query: <span className="
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
                  <div>data-panel-open: <span className="panel-open:inline panel-closed:hidden">true</span><span className="panel-open:hidden panel-closed:inline">false</span></div>
                  <div>data-device-mobile: <span className="device-mobile:inline device-desktop:hidden">true</span><span className="device-mobile:hidden device-desktop:inline">false</span></div>
                  <div>data-semantic-size: <span className="content-mobile:inline content-tablet:hidden content-desktop:hidden">mobile</span><span className="content-mobile:hidden content-tablet:inline content-desktop:hidden">tablet</span><span className="content-mobile:hidden content-tablet:hidden content-desktop:inline">desktop</span></div>
                </div>
              </div>
            </div>
          </ContentResponsiveWrapper>
        </div>

        {/* CSS-based Demo */}
        <ContentMediaDemo />
      </div>
    </div>
  )
}