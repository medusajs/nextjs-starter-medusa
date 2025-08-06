/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import '@testing-library/jest-dom'

import { 
  CompanionPanelProvider, 
  useCompanionPanel 
} from '../../../src/lib/context/companion-panel-context'
import { PanelType } from '../../../src/lib/types/panel-types'

// Mock window.innerWidth for responsive testing
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  window.dispatchEvent(new Event('resize'))
}

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CompanionPanelProvider>
    {children}
  </CompanionPanelProvider>
)

// Test component that uses the hook
const TestComponent: React.FC = () => {
  const {
    isOpen,
    currentPanel,
    panelHistory,
    isMobile,
    openPanel,
    closePanel,
    goBack,
    clearHistory,
    canGoBack,
    historyCount
  } = useCompanionPanel()

  return (
    <div>
      <div data-testid="is-open">{isOpen.toString()}</div>
      <div data-testid="current-panel">{currentPanel?.type || 'none'}</div>
      <div data-testid="history-count">{historyCount}</div>
      <div data-testid="can-go-back">{canGoBack.toString()}</div>
      <div data-testid="is-mobile">{isMobile.toString()}</div>
      
      <button 
        data-testid="open-cart" 
        onClick={() => openPanel('cart', { source: 'test' }, 'Test Cart')}
      >
        Open Cart
      </button>
      
      <button 
        data-testid="open-filter" 
        onClick={() => openPanel('filter', { filters: {} }, 'Filter Panel')}
      >
        Open Filter
      </button>
      
      <button 
        data-testid="close-panel" 
        onClick={closePanel}
      >
        Close Panel
      </button>
      
      <button 
        data-testid="go-back" 
        onClick={goBack}
      >
        Go Back
      </button>
      
      <button 
        data-testid="clear-history" 
        onClick={clearHistory}
      >
        Clear History
      </button>
    </div>
  )
}

describe('CompanionPanelContext', () => {
  beforeEach(() => {
    // Reset window width to desktop
    mockInnerWidth(1024)
    
    // Clear localStorage
    localStorage.clear()
    
    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Initial State', () => {
    test('should initialize with correct default state', () => {
      render(<TestComponent />, { wrapper: TestWrapper })
      
      expect(screen.getByTestId('is-open')).toHaveTextContent('false')
      expect(screen.getByTestId('current-panel')).toHaveTextContent('none')
      expect(screen.getByTestId('history-count')).toHaveTextContent('0')
      expect(screen.getByTestId('can-go-back')).toHaveTextContent('false')
      expect(screen.getByTestId('is-mobile')).toHaveTextContent('false')
    })

    test('should detect mobile correctly', () => {
      mockInnerWidth(500)
      
      render(<TestComponent />, { wrapper: TestWrapper })
      
      expect(screen.getByTestId('is-mobile')).toHaveTextContent('true')
    })
  })

  describe('Panel Opening', () => {
    test('should open panel correctly', async () => {
      render(<TestComponent />, { wrapper: TestWrapper })
      
      fireEvent.click(screen.getByTestId('open-cart'))
      
      await waitFor(() => {
        expect(screen.getByTestId('is-open')).toHaveTextContent('true')
        expect(screen.getByTestId('current-panel')).toHaveTextContent('cart')
        expect(screen.getByTestId('history-count')).toHaveTextContent('0')
      })
    })

    test('should create panel history when opening multiple panels', async () => {
      render(<TestComponent />, { wrapper: TestWrapper })
      
      // Open cart first
      fireEvent.click(screen.getByTestId('open-cart'))
      
      await waitFor(() => {
        expect(screen.getByTestId('current-panel')).toHaveTextContent('cart')
      })
      
      // Open filter panel (should create history)
      fireEvent.click(screen.getByTestId('open-filter'))
      
      await waitFor(() => {
        expect(screen.getByTestId('current-panel')).toHaveTextContent('filter')
        expect(screen.getByTestId('history-count')).toHaveTextContent('1')
        expect(screen.getByTestId('can-go-back')).toHaveTextContent('true')
      })
    })

    test('should handle panel data correctly', () => {
      const { result } = renderHook(() => useCompanionPanel(), {
        wrapper: TestWrapper
      })

      act(() => {
        result.current.openPanel('cart', { items: [1, 2, 3], source: 'test' }, 'Custom Title')
      })

      expect(result.current.currentPanel).toEqual({
        type: 'cart',
        data: { items: [1, 2, 3], source: 'test' },
        title: 'Custom Title',
        timestamp: expect.any(Number)
      })
    })
  })

  describe('Panel Closing', () => {
    test('should close panel and clear history', async () => {
      render(<TestComponent />, { wrapper: TestWrapper })
      
      // Open panels to create history
      fireEvent.click(screen.getByTestId('open-cart'))
      fireEvent.click(screen.getByTestId('open-filter'))
      
      await waitFor(() => {
        expect(screen.getByTestId('history-count')).toHaveTextContent('1')
      })
      
      // Close panel
      fireEvent.click(screen.getByTestId('close-panel'))
      
      await waitFor(() => {
        expect(screen.getByTestId('is-open')).toHaveTextContent('false')
        expect(screen.getByTestId('current-panel')).toHaveTextContent('none')
        expect(screen.getByTestId('history-count')).toHaveTextContent('0')
        expect(screen.getByTestId('can-go-back')).toHaveTextContent('false')
      })
    })
  })

  describe('History Navigation', () => {
    test('should navigate back through history correctly', async () => {
      render(<TestComponent />, { wrapper: TestWrapper })
      
      // Create history: cart -> filter
      fireEvent.click(screen.getByTestId('open-cart'))
      fireEvent.click(screen.getByTestId('open-filter'))
      
      await waitFor(() => {
        expect(screen.getByTestId('current-panel')).toHaveTextContent('filter')
        expect(screen.getByTestId('history-count')).toHaveTextContent('1')
      })
      
      // Go back
      fireEvent.click(screen.getByTestId('go-back'))
      
      await waitFor(() => {
        expect(screen.getByTestId('current-panel')).toHaveTextContent('cart')
        expect(screen.getByTestId('history-count')).toHaveTextContent('0')
        expect(screen.getByTestId('can-go-back')).toHaveTextContent('false')
      })
    })

    test('should close panel when going back with no history', async () => {
      render(<TestComponent />, { wrapper: TestWrapper })
      
      // Open single panel
      fireEvent.click(screen.getByTestId('open-cart'))
      
      await waitFor(() => {
        expect(screen.getByTestId('current-panel')).toHaveTextContent('cart')
        expect(screen.getByTestId('can-go-back')).toHaveTextContent('false')
      })
      
      // Go back (should close panel)
      fireEvent.click(screen.getByTestId('go-back'))
      
      await waitFor(() => {
        expect(screen.getByTestId('is-open')).toHaveTextContent('false')
        expect(screen.getByTestId('current-panel')).toHaveTextContent('none')
      })
    })

    test('should clear history correctly', async () => {
      render(<TestComponent />, { wrapper: TestWrapper })
      
      // Create history
      fireEvent.click(screen.getByTestId('open-cart'))
      fireEvent.click(screen.getByTestId('open-filter'))
      
      await waitFor(() => {
        expect(screen.getByTestId('history-count')).toHaveTextContent('1')
      })
      
      // Clear history
      fireEvent.click(screen.getByTestId('clear-history'))
      
      await waitFor(() => {
        expect(screen.getByTestId('history-count')).toHaveTextContent('0')
        expect(screen.getByTestId('can-go-back')).toHaveTextContent('false')
        // Panel should still be open
        expect(screen.getByTestId('is-open')).toHaveTextContent('true')
      })
    })
  })

  describe('Responsive Behavior', () => {
    test('should update mobile state on window resize', async () => {
      render(<TestComponent />, { wrapper: TestWrapper })
      
      // Start desktop
      expect(screen.getByTestId('is-mobile')).toHaveTextContent('false')
      
      // Resize to mobile
      act(() => {
        mockInnerWidth(600)
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('is-mobile')).toHaveTextContent('true')
      })
      
      // Resize back to desktop
      act(() => {
        mockInnerWidth(1024)
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('is-mobile')).toHaveTextContent('false')
      })
    })
  })

  describe('Legacy Cart API', () => {
    test('should provide backward compatible cart methods', () => {
      const { result } = renderHook(() => useCompanionPanel(), {
        wrapper: TestWrapper
      })

      // Test legacy methods exist
      expect(typeof result.current.openCartPanel).toBe('function')
      expect(typeof result.current.closeCartPanel).toBe('function')
      expect(typeof result.current.toggleCartPanel).toBe('function')

      // Test openCartPanel
      act(() => {
        result.current.openCartPanel()
      })

      expect(result.current.isOpen).toBe(true)
      expect(result.current.currentPanel?.type).toBe('cart')
    })

    test('should toggle cart panel correctly', () => {
      const { result } = renderHook(() => useCompanionPanel(), {
        wrapper: TestWrapper
      })

      // Toggle open
      act(() => {
        result.current.toggleCartPanel()
      })

      expect(result.current.isOpen).toBe(true)
      expect(result.current.currentPanel?.type).toBe('cart')

      // Toggle close
      act(() => {
        result.current.toggleCartPanel()
      })

      expect(result.current.isOpen).toBe(false)
      expect(result.current.currentPanel).toBe(null)
    })
  })

  describe('Error Handling', () => {
    test('should handle invalid panel types gracefully', () => {
      const { result } = renderHook(() => useCompanionPanel(), {
        wrapper: TestWrapper
      })

      // This should not crash and should be ignored due to feature flags
      act(() => {
        // @ts-ignore - intentionally testing invalid type
        result.current.openPanel('invalid-panel-type')
      })

      // Should not open the panel (invalid type)
      expect(result.current.isOpen).toBe(false)
    })

    test('should handle undefined data gracefully', () => {
      const { result } = renderHook(() => useCompanionPanel(), {
        wrapper: TestWrapper
      })

      act(() => {
        result.current.openPanel('cart', undefined, 'Test Cart')
      })

      expect(result.current.currentPanel).toEqual({
        type: 'cart',
        data: undefined,
        title: 'Test Cart',
        timestamp: expect.any(Number)
      })
    })
  })

  describe('Performance', () => {
    test('should limit panel history to prevent memory issues', () => {
      const { result } = renderHook(() => useCompanionPanel(), {
        wrapper: TestWrapper
      })

      // Open 15 panels (more than the 10 limit)
      act(() => {
        for (let i = 0; i < 15; i++) {
          result.current.openPanel('cart', { index: i }, `Panel ${i}`)
          result.current.openPanel('filter', { index: i }, `Filter ${i}`)
        }
      })

      // Should be limited to 10 items
      expect(result.current.panelHistory.length).toBeLessThanOrEqual(10)
    })
  })
})

describe('CompanionPanelProvider', () => {
  test('should throw error when useCompanionPanel is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const TestComponentWithoutProvider = () => {
      useCompanionPanel()
      return <div>Test</div>
    }

    expect(() => {
      render(<TestComponentWithoutProvider />)
    }).toThrow('useCompanionPanel must be used within a CompanionPanelProvider')

    consoleSpy.mockRestore()
  })

  test('should provide context value to children', () => {
    const TestChild = () => {
      const context = useCompanionPanel()
      return <div data-testid="context-exists">{context ? 'exists' : 'missing'}</div>
    }

    render(
      <CompanionPanelProvider>
        <TestChild />
      </CompanionPanelProvider>
    )

    expect(screen.getByTestId('context-exists')).toHaveTextContent('exists')
  })
})

// Integration test for complex workflows
describe('Complex Workflow Integration', () => {
  test('should handle filter to cart workflow', async () => {
    const { result } = renderHook(() => useCompanionPanel(), {
      wrapper: TestWrapper
    })

    // Step 1: Open filter panel
    act(() => {
      result.current.openPanel('filter', { 
        activeFilters: { category: 'electronics' },
        source: 'product-discovery' 
      }, 'Product Filters')
    })

    expect(result.current.currentPanel?.type).toBe('filter')
    expect(result.current.historyCount).toBe(0)

    // Step 2: User adds item to cart from filtered results
    act(() => {
      result.current.openPanel('cart', {
        newItems: ['product1'],
        source: 'filtered-results'
      }, 'Shopping Cart')
    })

    expect(result.current.currentPanel?.type).toBe('cart')
    expect(result.current.historyCount).toBe(1)

    // Step 3: Navigate back through history
    act(() => {
      result.current.goBack() // Back to filter
    })

    expect(result.current.currentPanel?.type).toBe('filter')
    expect(result.current.historyCount).toBe(0)

    act(() => {
      result.current.goBack() // Close entirely
    })

    expect(result.current.isOpen).toBe(false)
    expect(result.current.currentPanel).toBe(null)
  })
})