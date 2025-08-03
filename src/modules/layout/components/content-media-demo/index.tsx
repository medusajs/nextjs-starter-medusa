"use client"

import React from 'react'
import { useContentMediaQuery } from '@lib/hooks/use-content-media-query'

/**
 * Demo component showing how to use the custom content media query system
 * 
 * This component demonstrates:
 * 1. Using the useContentMediaQuery hook in JavaScript
 * 2. CSS classes that respond to data attributes
 * 3. Mobile-first responsive design based on content area width
 */
const ContentMediaDemo: React.FC = () => {
  const { 
    contentWidth, 
    currentSize, 
    semanticSize, 
    isSize, 
    isSemantic, 
    isAtLeast 
  } = useContentMediaQuery()

  return (
    <div className="content-responsive-padding bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Custom Content Media Query Demo</h2>
      
      {/* Real-time measurements */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Real-time Measurements:</h3>
        <ul className="space-y-1 text-sm">
          <li><strong>Content Width:</strong> {contentWidth}px</li>
          <li><strong>Current Size:</strong> {currentSize}</li>
          <li><strong>Semantic Size:</strong> {semanticSize}</li>
        </ul>
      </div>

      {/* JavaScript-based responsive logic */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">JavaScript Responsive Logic:</h3>
        <div className="grid gap-2 text-sm">
          {isSize('xs') && (
            <div className="bg-red-100 text-red-800 p-2 rounded">
              Extra Small Content Area - Perfect for mobile-like layouts
            </div>
          )}
          
          {isSize('sm') && (
            <div className="bg-orange-100 text-orange-800 p-2 rounded">
              Small Content Area - Good for tablet-like layouts
            </div>
          )}
          
          {isAtLeast('md') && (
            <div className="bg-green-100 text-green-800 p-2 rounded">
              Medium+ Content Area - Great for desktop layouts
            </div>
          )}
          
          {isSemantic('mobile') && (
            <div className="bg-blue-100 text-blue-800 p-2 rounded">
              Mobile Semantic Size - Optimized for touch interfaces
            </div>
          )}
        </div>
      </div>

      {/* CSS-based responsive demo */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">CSS-Based Responsive Demo:</h3>
        
        {/* Product grid that responds to content area */}
        <div className="product-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div 
              key={index}
              className="bg-gray-200 aspect-square rounded flex items-center justify-center text-sm font-medium"
            >
              Product {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation that changes layout based on content area */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Content-Aware Navigation:</h3>
        <nav className="nav-menu bg-gray-100 p-3 rounded">
          <a href="#" className="text-blue-600 hover:text-blue-800">Home</a>
          <a href="#" className="text-blue-600 hover:text-blue-800">Products</a>
          <a href="#" className="text-blue-600 hover:text-blue-800">About</a>
          <a href="#" className="text-blue-600 hover:text-blue-800">Contact</a>
        </nav>
      </div>

      {/* Card layout example */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Adaptive Card Layout:</h3>
        <div className="card-layout">
          <div className="flex-1 bg-blue-50 p-4 rounded">
            <h4 className="font-medium">Main Content</h4>
            <p className="text-sm text-gray-600 mt-1">
              This content area adapts based on available space, not just device size.
            </p>
          </div>
          
          <div className="sidebar bg-green-50 p-4 rounded">
            <h4 className="font-medium">Sidebar</h4>
            <p className="text-sm text-gray-600 mt-1">
              This sidebar appears/disappears based on content width.
            </p>
          </div>
        </div>
      </div>

      {/* Utility classes demo */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Utility Classes Demo:</h3>
        <div className="space-y-2 text-sm">
          <div className="show-on-xs bg-red-100 text-red-800 p-2 rounded">
            Only visible when content area is XS
          </div>
          <div className="show-on-sm bg-orange-100 text-orange-800 p-2 rounded">
            Only visible when content area is SM
          </div>
          <div className="show-on-md bg-green-100 text-green-800 p-2 rounded">
            Only visible when content area is MD+
          </div>
          <div className="hide-on-xs bg-gray-100 text-gray-800 p-2 rounded">
            Hidden when content area is XS
          </div>
        </div>
      </div>

      {/* Code example */}
      <div className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto">
        <h3 className="text-white font-semibold mb-2">CSS Example:</h3>
        <pre>{`/* Mobile first (default) */
.product-grid {
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Content area SM+ */
[data-media-query="sm"] .product-grid,
[data-media-query="md"] .product-grid,
[data-media-query="lg"] .product-grid {
  grid-template-columns: repeat(2, 1fr);
}

/* Content area MD+ */
[data-media-query="md"] .product-grid,
[data-media-query="lg"] .product-grid {
  grid-template-columns: repeat(3, 1fr);
}`}</pre>
      </div>
    </div>
  )
}

export default ContentMediaDemo