const plugin = require('tailwindcss/plugin')

/**
 * Content-Area Responsive Plugin for Tailwind CSS
 * 
 * Adds responsive variants based on content area width instead of viewport width.
 * Uses our custom data-media-query attribute system from useContentMediaQuery hook.
 * 
 * Usage Examples:
 * <div className="cxs:hidden csm:block cmd:p-4 clg:text-xl cxl:grid-cols-4">
 *   Content that responds to content area, not viewport!
 * </div>
 * 
 * <div className="panel-open-cmd:grid-cols-2 panel-closed:grid-cols-4">
 *   Grid changes when companion panel opens/closes
 * </div>
 */

const contentMediaPlugin = plugin(function({ addVariant }) {
  // =============================================================================
  // CONTENT-BASED BREAKPOINTS
  // Based on actual content area width (not viewport width)
  // =============================================================================
  
  // Content Extra Small (< 640px content width)
  addVariant('cxs', '[data-media-query="xs"] &')
  
  // Content Small (640px+ content width)  
  addVariant('csm', '[data-media-query="sm"] &')
  
  // Content Medium (768px+ content width)
  addVariant('cmd', '[data-media-query="md"] &')
  
  // Content Large (1024px+ content width)
  addVariant('clg', '[data-media-query="lg"] &')
  
  // Content Extra Large (1280px+ content width)
  addVariant('cxl', '[data-media-query="xl"] &')
  
  // =============================================================================
  // SEMANTIC SIZE VARIANTS
  // Human-readable breakpoints for better developer experience
  // =============================================================================
  
  addVariant('content-mobile', '[data-semantic-size="mobile"] &')
  addVariant('content-tablet', '[data-semantic-size="tablet"] &')  
  addVariant('content-desktop', '[data-semantic-size="desktop"] &')
  
  // =============================================================================
  // COMPANION PANEL STATE VARIANTS
  // Respond to panel open/closed state
  // =============================================================================
  
  addVariant('panel-open', '[data-panel-open="true"] &')
  addVariant('panel-closed', '[data-panel-open="false"] &')
  
  // =============================================================================
  // DEVICE AWARENESS VARIANTS
  // Distinguish between actual device vs content area compression
  // =============================================================================
  
  addVariant('device-mobile', '[data-device-mobile="true"] &')
  addVariant('device-desktop', '[data-device-mobile="false"] &')
  
  // =============================================================================
  // COMBINED VARIANTS
  // Advanced responsive behavior combining panel state + content size
  // =============================================================================
  
  // Panel open + content size combinations
  addVariant('panel-open-cxs', '[data-panel-open="true"][data-media-query="xs"] &')
  addVariant('panel-open-csm', '[data-panel-open="true"][data-media-query="sm"] &')
  addVariant('panel-open-cmd', '[data-panel-open="true"][data-media-query="md"] &')
  addVariant('panel-open-clg', '[data-panel-open="true"][data-media-query="lg"] &')
  addVariant('panel-open-cxl', '[data-panel-open="true"][data-media-query="xl"] &')
  
  // Panel closed + content size combinations
  addVariant('panel-closed-cxs', '[data-panel-open="false"][data-media-query="xs"] &')
  addVariant('panel-closed-csm', '[data-panel-open="false"][data-media-query="sm"] &')
  addVariant('panel-closed-cmd', '[data-panel-open="false"][data-media-query="md"] &')
  addVariant('panel-closed-clg', '[data-panel-open="false"][data-media-query="lg"] &')
  addVariant('panel-closed-cxl', '[data-panel-open="false"][data-media-query="xl"] &')
  
  // Device type + content size combinations
  addVariant('device-mobile-cxs', '[data-device-mobile="true"][data-media-query="xs"] &')
  addVariant('device-mobile-csm', '[data-device-mobile="true"][data-media-query="sm"] &')
  addVariant('device-desktop-cmd', '[data-device-mobile="false"][data-media-query="md"] &')
  addVariant('device-desktop-clg', '[data-device-mobile="false"][data-media-query="lg"] &')
  addVariant('device-desktop-cxl', '[data-device-mobile="false"][data-media-query="xl"] &')
})

module.exports = contentMediaPlugin