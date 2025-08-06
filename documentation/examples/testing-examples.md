# 🧪 Testing Examples

## Overview

Comprehensive testing examples for the Companion Panel System, covering unit tests, integration tests, and end-to-end testing scenarios. These examples demonstrate best practices for testing React Context, async operations, and complex user interactions.

## 📋 Table of Contents

1. [Unit Testing](#unit-testing)
2. [Integration Testing](#integration-testing)
3. [Component Testing](#component-testing)
4. [End-to-End Testing](#end-to-end-testing)
5. [Performance Testing](#performance-testing)
6. [Accessibility Testing](#accessibility-testing)

## 🔧 Unit Testing

### 1. Testing Context Provider

```typescript
// __tests__/lib/context/companion-panel-context.test.tsx
import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { CompanionPanelProvider, useCompanionPanel } from '@lib/context/companion-panel-context'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CompanionPanelProvider>{children}</CompanionPanelProvider>
)

describe('CompanionPanelContext', () => {
  test('should initialize with default state', () => {
    const { result } = renderHook(() => useCompanionPanel(), { wrapper })

    expect(result.current.isOpen).toBe(false)
    expect(result.current.currentPanel).toBeNull()
    expect(result.current.panelHistory).toEqual([])
    expect(result.current.historyCount).toBe(0)
    expect(result.current.canGoBack).toBe(false)
  })

  test('should open panel correctly', () => {
    const { result } = renderHook(() => useCompanionPanel(), { wrapper })

    act(() => {
      result.current.openPanel('cart', { test: true }, 'Test Cart')
    })

    expect(result.current.isOpen).toBe(true)
    expect(result.current.currentPanel).toEqual({
      type: 'cart',
      data: { test: true },
      title: 'Test Cart',
      timestamp: expect.any(Number)
    })
  })

  test('should create panel history when opening multiple panels', () => {
    const { result } = renderHook(() => useCompanionPanel(), { wrapper })

    act(() => {
      result.current.openPanel('cart')
    })

    act(() => {
      result.current.openPanel('filter')
    })

    expect(result.current.currentPanel?.type).toBe('filter')
    expect(result.current.historyCount).toBe(1)
    expect(result.current.canGoBack).toBe(true)
  })

  test('should navigate back through history', () => {
    const { result } = renderHook(() => useCompanionPanel(), { wrapper })

    // Create history
    act(() => {
      result.current.openPanel('cart')
    })
    act(() => {
      result.current.openPanel('filter')
    })

    // Go back
    act(() => {
      result.current.goBack()
    })

    expect(result.current.currentPanel?.type).toBe('cart')
    expect(result.current.historyCount).toBe(0)
    expect(result.current.canGoBack).toBe(false)
  })

  test('should close panel and clear history', () => {
    const { result } = renderHook(() => useCompanionPanel(), { wrapper })

    // Open panels
    act(() => {
      result.current.openPanel('cart')
    })
    act(() => {
      result.current.openPanel('filter')
    })

    // Close
    act(() => {
      result.current.closePanel()
    })

    expect(result.current.isOpen).toBe(false)
    expect(result.current.currentPanel).toBeNull()
    expect(result.current.panelHistory).toEqual([])
  })

  test('should handle mobile detection', () => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600
    })

    const { result } = renderHook(() => useCompanionPanel(), { wrapper })

    // Trigger resize event
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })

    expect(result.current.isMobile).toBe(true)
  })
})
```

### 2. Testing Configuration

```typescript
// __tests__/lib/config/companion-config.test.ts
import {
  isFeatureEnabled,
  getEnabledFeatures,
  getLayoutConfig
} from '@lib/config/companion-config'

// Mock store.config.js
jest.mock('../../../store.config.js', () => ({
  featureFlags: {
    aiCompanion: true,
    helpCompanion: false,
    wishlist: false,
    productCompare: false,
    reviews: false,
  },
  layoutOptions: {
    maxVisibleButtons: 3,
    showLabels: false,
    showIcons: true,
    defaultPanelWidth: 400,
    maxPanelHistory: 10,
  }
}))

describe('Companion Configuration', () => {
  test('should return correct feature enabled status', () => {
    expect(isFeatureEnabled('aiCompanion')).toBe(true)
    expect(isFeatureEnabled('helpCompanion')).toBe(false)
    expect(isFeatureEnabled('wishlist')).toBe(false)
  })

  test('should return only enabled features', () => {
    const enabledFeatures = getEnabledFeatures()
    
    expect(enabledFeatures).toHaveLength(1)
    expect(enabledFeatures[0].key).toBe('aiCompanion')
    expect(enabledFeatures[0].displayName).toBe('AI Shopping Assistant')
  })

  test('should return layout configuration', () => {
    const layoutConfig = getLayoutConfig()
    
    expect(layoutConfig.maxVisibleButtons).toBe(3)
    expect(layoutConfig.showLabels).toBe(false)
    expect(layoutConfig.defaultPanelWidth).toBe(400)
  })

  test('should handle non-existent features gracefully', () => {
    // @ts-ignore - testing runtime behavior
    expect(isFeatureEnabled('nonExistentFeature')).toBe(false)
  })
})
```

### 3. Testing Utility Functions

```typescript
// __tests__/lib/utils/panel-utils.test.ts
import { 
  validatePanelData, 
  formatPanelTitle, 
  calculatePanelWidth 
} from '@lib/utils/panel-utils'

describe('Panel Utilities', () => {
  describe('validatePanelData', () => {
    test('should validate cart panel data', () => {
      const validData = {
        items: [{ id: '1', quantity: 2 }],
        source: 'test'
      }
      
      expect(validatePanelData('cart', validData)).toBe(true)
    })

    test('should reject invalid cart data', () => {
      const invalidData = {
        items: 'invalid'
      }
      
      expect(validatePanelData('cart', invalidData)).toBe(false)
    })

    test('should handle null data gracefully', () => {
      expect(validatePanelData('cart', null)).toBe(true) // null is allowed
      expect(validatePanelData('cart', undefined)).toBe(true)
    })
  })

  describe('formatPanelTitle', () => {
    test('should format cart title with item count', () => {
      const data = { items: [{ id: '1' }, { id: '2' }] }
      const title = formatPanelTitle('cart', data)
      
      expect(title).toBe('Shopping Cart (2)')
    })

    test('should format AI assistant title with context', () => {
      const data = { context: 'product-inquiry', productName: 'Laptop' }
      const title = formatPanelTitle('ai-assistant', data)
      
      expect(title).toBe('AI Assistant - Laptop Inquiry')
    })

    test('should return default title for unknown panel types', () => {
      // @ts-ignore - testing runtime behavior
      const title = formatPanelTitle('unknown', {})
      
      expect(title).toBe('Panel')
    })
  })

  describe('calculatePanelWidth', () => {
    test('should return default width for desktop', () => {
      const width = calculatePanelWidth(false, 'cart')
      expect(width).toBe(400)
    })

    test('should return full width for mobile', () => {
      const width = calculatePanelWidth(true, 'cart')
      expect(width).toBe('100%')
    })

    test('should return custom width for specific panel types', () => {
      const width = calculatePanelWidth(false, 'ai-assistant')
      expect(width).toBe(500) // AI panels are wider
    })
  })
})
```

## 🔗 Integration Testing

### 1. Testing Panel Workflows

```typescript
// __tests__/integration/panel-workflows.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CompanionPanelProvider } from '@lib/context/companion-panel-context'
import { CartDrawerPanel } from '@modules/layout/components/cart-drawer'
import { mockCart, mockCartWithItems } from '../__mocks__/cart'

// Mock dependencies
jest.mock('@lib/data/cart', () => ({
  addToCart: jest.fn(),
  updateLineItem: jest.fn(),
  deleteLineItem: jest.fn()
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <CompanionPanelProvider>
    {children}
    <CartDrawerPanel cart={mockCartWithItems} />
  </CompanionPanelProvider>
)

describe('Panel Workflows', () => {
  test('should complete add-to-cart workflow', async () => {
    const TestComponent = () => {
      const { openPanel } = useCompanionPanel()
      
      const handleAddToCart = () => {
        openPanel('cart', {
          newItem: { id: 'product-1', quantity: 1 },
          source: 'product-page'
        })
      }

      return (
        <button onClick={handleAddToCart} data-testid="add-to-cart">
          Add to Cart
        </button>
      )
    }

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    // Click add to cart
    fireEvent.click(screen.getByTestId('add-to-cart'))

    // Cart panel should open
    await waitFor(() => {
      expect(screen.getByText('Shopping Cart')).toBeInTheDocument()
    })

    // Should show cart items
    expect(screen.getByText('Test Product 1')).toBeInTheDocument()
  })

  test('should handle panel navigation workflow', async () => {
    const NavigationTest = () => {
      const { openPanel, currentPanel, canGoBack, goBack } = useCompanionPanel()

      return (
        <div>
          <button onClick={() => openPanel('cart')} data-testid="open-cart">
            Cart
          </button>
          <button onClick={() => openPanel('filter')} data-testid="open-filter">
            Filter
          </button>
          <button 
            onClick={goBack} 
            data-testid="go-back"
            disabled={!canGoBack}
          >
            Back
          </button>
          <div data-testid="current-panel">
            {currentPanel?.type || 'none'}
          </div>
        </div>
      )
    }

    render(
      <TestWrapper>
        <NavigationTest />
      </TestWrapper>
    )

    // Open cart
    fireEvent.click(screen.getByTestId('open-cart'))
    expect(screen.getByTestId('current-panel')).toHaveTextContent('cart')

    // Open filter (creates history)
    fireEvent.click(screen.getByTestId('open-filter'))
    expect(screen.getByTestId('current-panel')).toHaveTextContent('filter')

    // Go back to cart
    fireEvent.click(screen.getByTestId('go-back'))
    expect(screen.getByTestId('current-panel')).toHaveTextContent('cart')
  })

  test('should handle error states gracefully', async () => {
    const { addToCart } = require('@lib/data/cart')
    addToCart.mockRejectedValue(new Error('Network error'))

    const ErrorTest = () => {
      const { openPanel } = useCompanionPanel()
      const [error, setError] = useState(null)

      const handleAddToCart = async () => {
        try {
          await addToCart({ variantId: 'variant-1', quantity: 1 })
          openPanel('cart')
        } catch (err) {
          setError(err.message)
        }
      }

      return (
        <div>
          <button onClick={handleAddToCart} data-testid="add-to-cart">
            Add to Cart
          </button>
          {error && <div data-testid="error">{error}</div>}
        </div>
      )
    }

    render(
      <TestWrapper>
        <ErrorTest />
      </TestWrapper>
    )

    fireEvent.click(screen.getByTestId('add-to-cart'))

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Network error')
    })

    // Panel should not open on error
    expect(screen.queryByText('Shopping Cart')).not.toBeInTheDocument()
  })
})
```

### 2. Testing API Integration

```typescript
// __tests__/integration/api-integration.test.ts
import { 
  addToCart, 
  updateLineItem, 
  deleteLineItem 
} from '@lib/data/cart'
import { sdk } from '@lib/config'

// Mock the SDK
jest.mock('@lib/config', () => ({
  sdk: {
    store: {
      cart: {
        createLineItem: jest.fn(),
        updateLineItem: jest.fn(),
        deleteLineItem: jest.fn()
      }
    }
  }
}))

jest.mock('@lib/data/cookies', () => ({
  getCartId: jest.fn(),
  setCartId: jest.fn(),
  getAuthHeaders: jest.fn(),
  getCacheOptions: jest.fn()
}))

jest.mock('next/cache', () => ({
  revalidateTag: jest.fn()
}))

describe('API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    require('@lib/data/cookies').getCartId.mockResolvedValue('cart-123')
    require('@lib/data/cookies').getAuthHeaders.mockResolvedValue({})
    require('@lib/data/cookies').getCacheOptions.mockResolvedValue({})
  })

  test('should add item to cart successfully', async () => {
    const mockCart = { id: 'cart-123', items: [] }
    sdk.store.cart.createLineItem.mockResolvedValue({ cart: mockCart })

    await addToCart({
      variantId: 'variant-123',
      quantity: 2,
      countryCode: 'us'
    })

    expect(sdk.store.cart.createLineItem).toHaveBeenCalledWith(
      'cart-123',
      { variant_id: 'variant-123', quantity: 2 },
      {},
      {}
    )
  })

  test('should handle API errors gracefully', async () => {
    const apiError = new Error('API Error')
    apiError.response = { status: 500, data: { message: 'Server error' } }
    
    sdk.store.cart.createLineItem.mockRejectedValue(apiError)

    await expect(addToCart({
      variantId: 'variant-123',
      quantity: 1,
      countryCode: 'us'
    })).rejects.toThrow()
  })

  test('should update line item quantity', async () => {
    const mockCart = { id: 'cart-123', items: [] }
    sdk.store.cart.updateLineItem.mockResolvedValue({ cart: mockCart })

    await updateLineItem({
      lineId: 'line-123',
      quantity: 3
    })

    expect(sdk.store.cart.updateLineItem).toHaveBeenCalledWith(
      'cart-123',
      'line-123',
      { quantity: 3 },
      {},
      {}
    )
  })

  test('should delete line item', async () => {
    const mockCart = { id: 'cart-123', items: [] }
    sdk.store.cart.deleteLineItem.mockResolvedValue({ cart: mockCart })

    await deleteLineItem('line-123')

    expect(sdk.store.cart.deleteLineItem).toHaveBeenCalledWith(
      'cart-123',
      'line-123',
      {}
    )
  })

  test('should handle network errors', async () => {
    const networkError = new Error('Network Error')
    networkError.request = {}
    
    sdk.store.cart.createLineItem.mockRejectedValue(networkError)

    await expect(addToCart({
      variantId: 'variant-123',
      quantity: 1,
      countryCode: 'us'
    })).rejects.toThrow('Network Error')
  })
})
```

## 🎨 Component Testing

### 1. Testing Panel Components

```typescript
// __tests__/components/cart-drawer.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CompanionPanelProvider, useCompanionPanel } from '@lib/context/companion-panel-context'
import CartDrawerPanel from '@modules/layout/components/cart-drawer'

const mockCart = {
  id: 'cart-123',
  items: [
    {
      id: 'item-1',
      title: 'Test Product',
      quantity: 2,
      unit_price: 1000,
      total: 2000,
      variant: { title: 'Size M' }
    }
  ],
  subtotal: 2000,
  total: 2000,
  currency_code: 'usd'
}

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const [panelOpen, setPanelOpen] = useState(false)
  
  return (
    <CompanionPanelProvider>
      <button onClick={() => setPanelOpen(true)} data-testid="open-panel">
        Open Panel
      </button>
      {children}
    </CompanionPanelProvider>
  )
}

describe('CartDrawerPanel', () => {
  test('should not render when panel is closed', () => {
    render(
      <TestWrapper>
        <CartDrawerPanel cart={mockCart} />
      </TestWrapper>
    )

    expect(screen.queryByText('Shopping Cart')).not.toBeInTheDocument()
  })

  test('should render cart items when panel is open', async () => {
    const TestComponent = () => {
      const { openPanel } = useCompanionPanel()
      
      useEffect(() => {
        openPanel('cart')
      }, [openPanel])

      return <CartDrawerPanel cart={mockCart} />
    }

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Shopping Cart (2)')).toBeInTheDocument()
    })

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Quantity: 2')).toBeInTheDocument()
    expect(screen.getByText('$20.00')).toBeInTheDocument()
  })

  test('should handle empty cart', async () => {
    const emptyCart = { ...mockCart, items: [] }
    
    const TestComponent = () => {
      const { openPanel } = useCompanionPanel()
      
      useEffect(() => {
        openPanel('cart')
      }, [openPanel])

      return <CartDrawerPanel cart={emptyCart} />
    }

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText('Your shopping bag is empty.')).toBeInTheDocument()
    })

    expect(screen.getByText('Explore products')).toBeInTheDocument()
  })

  test('should close panel when close button is clicked', async () => {
    const TestComponent = () => {
      const { openPanel, isOpen } = useCompanionPanel()
      
      useEffect(() => {
        openPanel('cart')
      }, [openPanel])

      return (
        <div>
          <div data-testid="panel-status">{isOpen ? 'open' : 'closed'}</div>
          <CartDrawerPanel cart={mockCart} />
        </div>
      )
    }

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('panel-status')).toHaveTextContent('open')
    })

    // Click close button
    fireEvent.click(screen.getByLabelText('Close'))

    await waitFor(() => {
      expect(screen.getByTestId('panel-status')).toHaveTextContent('closed')
    })
  })

  test('should handle mobile vs desktop rendering', async () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600
    })

    const TestComponent = () => {
      const { openPanel } = useCompanionPanel()
      
      useEffect(() => {
        openPanel('cart')
        // Trigger resize to update mobile state
        window.dispatchEvent(new Event('resize'))
      }, [openPanel])

      return <CartDrawerPanel cart={mockCart} />
    }

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    await waitFor(() => {
      // Should render mobile modal
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })
})
```

### 2. Testing Custom Hooks

```typescript
// __tests__/hooks/use-panel-state.test.ts
import { renderHook, act } from '@testing-library/react'
import { usePanelState } from '@lib/hooks/use-panel-state'

describe('usePanelState', () => {
  test('should initialize with default state', () => {
    const { result } = renderHook(() => usePanelState())

    expect(result.current.panels).toEqual([])
    expect(result.current.currentPanel).toBeNull()
    expect(result.current.isOpen).toBe(false)
  })

  test('should add panel to state', () => {
    const { result } = renderHook(() => usePanelState())

    act(() => {
      result.current.addPanel({
        type: 'cart',
        data: { test: true },
        title: 'Test Cart',
        timestamp: Date.now()
      })
    })

    expect(result.current.panels).toHaveLength(1)
    expect(result.current.currentPanel?.type).toBe('cart')
    expect(result.current.isOpen).toBe(true)
  })

  test('should remove panel from state', () => {
    const { result } = renderHook(() => usePanelState())

    // Add panel
    act(() => {
      result.current.addPanel({
        type: 'cart',
        data: {},
        title: 'Cart',
        timestamp: Date.now()
      })
    })

    // Remove panel
    act(() => {
      result.current.removePanel()
    })

    expect(result.current.panels).toHaveLength(0)
    expect(result.current.currentPanel).toBeNull()
    expect(result.current.isOpen).toBe(false)
  })

  test('should handle panel history correctly', () => {
    const { result } = renderHook(() => usePanelState())

    // Add multiple panels
    act(() => {
      result.current.addPanel({
        type: 'cart',
        data: {},
        title: 'Cart',
        timestamp: Date.now()
      })
    })

    act(() => {
      result.current.addPanel({
        type: 'filter',
        data: {},
        title: 'Filter',
        timestamp: Date.now() + 1
      })
    })

    expect(result.current.panels).toHaveLength(2)
    expect(result.current.currentPanel?.type).toBe('filter')

    // Go back
    act(() => {
      result.current.goBack()
    })

    expect(result.current.currentPanel?.type).toBe('cart')
    expect(result.current.panels).toHaveLength(1)
  })
})
```

## 🌐 End-to-End Testing

### 1. Playwright E2E Tests

```typescript
// e2e/companion-panel.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Companion Panel System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products/test-product')
  })

  test('should open cart panel when adding product', async ({ page }) => {
    // Add product to cart
    await page.click('[data-testid="add-to-cart"]')

    // Cart panel should open
    await expect(page.locator('[data-testid="cart-panel"]')).toBeVisible()
    await expect(page.locator('text=Shopping Cart')).toBeVisible()

    // Should show added product
    await expect(page.locator('text=Test Product')).toBeVisible()
  })

  test('should navigate between panels', async ({ page }) => {
    // Open cart
    await page.click('[data-testid="cart-trigger"]')
    await expect(page.locator('[data-testid="cart-panel"]')).toBeVisible()

    // Open filters from cart
    await page.click('[data-testid="open-filters"]')
    await expect(page.locator('[data-testid="filter-panel"]')).toBeVisible()

    // Should have back button
    await expect(page.locator('[data-testid="back-button"]')).toBeVisible()

    // Go back to cart
    await page.click('[data-testid="back-button"]')
    await expect(page.locator('[data-testid="cart-panel"]')).toBeVisible()
  })

  test('should handle mobile responsive behavior', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Open cart
    await page.click('[data-testid="cart-trigger"]')

    // Should render as modal on mobile
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    
    // Should cover full screen
    const modal = page.locator('[role="dialog"]')
    const box = await modal.boundingBox()
    expect(box?.width).toBeCloseTo(375, 10)
  })

  test('should close panel with escape key', async ({ page }) => {
    // Open cart
    await page.click('[data-testid="cart-trigger"]')
    await expect(page.locator('[data-testid="cart-panel"]')).toBeVisible()

    // Press escape
    await page.keyboard.press('Escape')
    
    // Panel should close
    await expect(page.locator('[data-testid="cart-panel"]')).not.toBeVisible()
  })

  test('should handle AI assistant workflow', async ({ page }) => {
    // Skip if AI feature is disabled
    const aiButton = page.locator('[data-testid="ai-assistant-button"]')
    if (!(await aiButton.isVisible())) {
      test.skip('AI Assistant is disabled')
    }

    // Open AI assistant
    await aiButton.click()
    await expect(page.locator('[data-testid="ai-panel"]')).toBeVisible()

    // Type a query
    await page.fill('[data-testid="ai-input"]', 'Help me find a laptop')
    await page.press('[data-testid="ai-input"]', 'Enter')

    // Should show typing indicator
    await expect(page.locator('[data-testid="typing-indicator"]')).toBeVisible()

    // Should receive response (mock or actual)
    await expect(page.locator('[data-testid="ai-response"]')).toBeVisible({ timeout: 10000 })
  })

  test('should persist panel state across page navigation', async ({ page }) => {
    // Open cart and add items
    await page.click('[data-testid="add-to-cart"]')
    await expect(page.locator('[data-testid="cart-panel"]')).toBeVisible()

    // Navigate to another page
    await page.click('[data-testid="home-link"]')
    await page.waitForURL('/')

    // Cart should still be accessible
    await page.click('[data-testid="cart-trigger"]')
    await expect(page.locator('[data-testid="cart-panel"]')).toBeVisible()
    await expect(page.locator('text=Test Product')).toBeVisible()
  })
})
```

### 2. Cypress E2E Tests

```typescript
// cypress/e2e/companion-panel.cy.ts
describe('Companion Panel System', () => {
  beforeEach(() => {
    cy.visit('/products/test-product')
  })

  it('should complete full shopping workflow', () => {
    // Add product to cart
    cy.get('[data-testid="add-to-cart"]').click()
    
    // Cart should auto-open
    cy.get('[data-testid="cart-panel"]').should('be.visible')
    cy.contains('Shopping Cart (1)')
    
    // Add another product
    cy.get('[data-testid="quantity-increase"]').click()
    cy.contains('Shopping Cart (2)')
    
    // Go to checkout
    cy.get('[data-testid="checkout-button"]').click()
    cy.url().should('include', '/checkout')
  })

  it('should handle error states gracefully', () => {
    // Mock API error
    cy.intercept('POST', '/api/cart/items', { statusCode: 500 }).as('addToCartError')
    
    // Try to add product
    cy.get('[data-testid="add-to-cart"]').click()
    
    // Should show error message
    cy.get('[data-testid="error-message"]').should('be.visible')
    cy.contains('Failed to add item to cart')
    
    // Panel should not open
    cy.get('[data-testid="cart-panel"]').should('not.exist')
  })

  it('should support keyboard navigation', () => {
    // Open cart with keyboard
    cy.get('body').type('{alt}c') // Assuming Alt+C opens cart
    cy.get('[data-testid="cart-panel"]').should('be.visible')
    
    // Navigate with tab
    cy.get('[data-testid="cart-panel"]').within(() => {
      cy.get('[data-testid="quantity-input"]').focus()
      cy.tab()
      cy.get('[data-testid="remove-button"]').should('be.focused')
    })
    
    // Close with escape
    cy.get('body').type('{esc}')
    cy.get('[data-testid="cart-panel"]').should('not.exist')
  })

  it('should handle concurrent panel operations', () => {
    // Rapidly open/close panels
    cy.get('[data-testid="cart-trigger"]').click()
    cy.get('[data-testid="filter-trigger"]').click()
    cy.get('[data-testid="ai-trigger"]').click()
    
    // Should handle gracefully without crashes
    cy.get('[data-testid="ai-panel"]').should('be.visible')
    
    // History should work
    cy.get('[data-testid="back-button"]').click()
    cy.get('[data-testid="filter-panel"]').should('be.visible')
  })
})
```

## ⚡ Performance Testing

### 1. Performance Benchmarks

```typescript
// __tests__/performance/panel-performance.test.ts
import { performance } from 'perf_hooks'
import { renderHook, act } from '@testing-library/react'
import { CompanionPanelProvider, useCompanionPanel } from '@lib/context/companion-panel-context'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CompanionPanelProvider>{children}</CompanionPanelProvider>
)

describe('Panel Performance', () => {
  test('should open panel within performance budget', async () => {
    const { result } = renderHook(() => useCompanionPanel(), { wrapper })

    const startTime = performance.now()
    
    await act(async () => {
      result.current.openPanel('cart', { items: [] })
    })
    
    const endTime = performance.now()
    const duration = endTime - startTime

    // Should open within 100ms
    expect(duration).toBeLessThan(100)
  })

  test('should handle rapid panel switching efficiently', async () => {
    const { result } = renderHook(() => useCompanionPanel(), { wrapper })

    const startTime = performance.now()
    
    await act(async () => {
      // Rapidly switch between panels
      for (let i = 0; i < 10; i++) {
        result.current.openPanel(i % 2 === 0 ? 'cart' : 'filter')
      }
    })
    
    const endTime = performance.now()
    const duration = endTime - startTime

    // Should complete within 500ms
    expect(duration).toBeLessThan(500)
  })

  test('should maintain memory within limits', () => {
    const { result } = renderHook(() => useCompanionPanel(), { wrapper })

    // Create many panels to test memory usage
    act(() => {
      for (let i = 0; i < 100; i++) {
        result.current.openPanel('cart', { 
          items: new Array(100).fill({ id: i }) 
        })
      }
    })

    // History should be limited to prevent memory leaks
    expect(result.current.panelHistory.length).toBeLessThanOrEqual(10)
  })

  test('should debounce rapid state changes', async () => {
    const { result } = renderHook(() => useCompanionPanel(), { wrapper })
    let renderCount = 0

    // Monitor renders
    const originalUseState = React.useState
    jest.spyOn(React, 'useState').mockImplementation((initial) => {
      renderCount++
      return originalUseState(initial)
    })

    await act(async () => {
      // Rapid state changes
      for (let i = 0; i < 50; i++) {
        result.current.openPanel('cart')
        result.current.closePanel()
      }
    })

    // Should not cause excessive renders
    expect(renderCount).toBeLessThan(200) // Reasonable threshold
  })
})
```

### 2. Memory Leak Detection

```typescript
// __tests__/performance/memory-leaks.test.ts
import { renderHook, act } from '@testing-library/react'
import { useCompanionPanel } from '@lib/context/companion-panel-context'

// Mock performance.memory for testing
const mockMemory = {
  usedJSHeapSize: 1000000,
  totalJSHeapSize: 2000000,
  jsHeapSizeLimit: 4000000
}

Object.defineProperty(performance, 'memory', {
  value: mockMemory,
  writable: true
})

describe('Memory Leak Detection', () => {
  test('should not leak memory with repeated panel operations', () => {
    const { result, unmount } = renderHook(() => useCompanionPanel())
    const initialMemory = performance.memory.usedJSHeapSize

    // Perform many operations
    act(() => {
      for (let i = 0; i < 1000; i++) {
        result.current.openPanel('cart', { 
          data: new Array(1000).fill(i) 
        })
        result.current.closePanel()
      }
    })

    // Force garbage collection if available
    if (global.gc) {
      global.gc()
    }

    const finalMemory = performance.memory.usedJSHeapSize
    const memoryIncrease = finalMemory - initialMemory

    // Memory increase should be minimal
    expect(memoryIncrease).toBeLessThan(initialMemory * 0.1) // Less than 10% increase

    unmount()
  })

  test('should cleanup event listeners on unmount', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => useCompanionPanel())

    // Should have added event listeners
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))

    unmount()

    // Should have cleaned up listeners
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })
})
```

## ♿ Accessibility Testing

### 1. A11y Unit Tests

```typescript
// __tests__/accessibility/panel-a11y.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { CompanionPanelProvider } from '@lib/context/companion-panel-context'
import CartDrawerPanel from '@modules/layout/components/cart-drawer'

expect.extend(toHaveNoViolations)

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <CompanionPanelProvider>
    {children}
  </CompanionPanelProvider>
)

describe('Panel Accessibility', () => {
  test('should have no accessibility violations', async () => {
    const TestComponent = () => {
      const { openPanel } = useCompanionPanel()
      
      useEffect(() => {
        openPanel('cart')
      }, [openPanel])

      return <CartDrawerPanel cart={mockCart} />
    }

    const { container } = render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  test('should have proper ARIA attributes', async () => {
    const TestComponent = () => {
      const { openPanel } = useCompanionPanel()
      
      useEffect(() => {
        openPanel('cart')
      }, [openPanel])

      return <CartDrawerPanel cart={mockCart} />
    }

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    // Panel should be a dialog
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    
    // Should have aria-modal
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
    
    // Should have aria-labelledby
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby')
    
    // Close button should have aria-label
    expect(screen.getByLabelText('Close')).toBeInTheDocument()
  })

  test('should manage focus correctly', async () => {
    const TestComponent = () => {
      const { openPanel, isOpen } = useCompanionPanel()
      
      return (
        <div>
          <button onClick={() => openPanel('cart')} data-testid="trigger">
            Open Cart
          </button>
          {isOpen && <CartDrawerPanel cart={mockCart} />}
        </div>
      )
    }

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    const trigger = screen.getByTestId('trigger')
    trigger.focus()
    expect(trigger).toHaveFocus()

    // Open panel
    fireEvent.click(trigger)

    await waitFor(() => {
      // Focus should move to panel
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveFocus()
    })
  })

  test('should support keyboard navigation', async () => {
    const TestComponent = () => {
      const { openPanel } = useCompanionPanel()
      
      useEffect(() => {
        openPanel('cart')
      }, [openPanel])

      return <CartDrawerPanel cart={mockCart} />
    }

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    const dialog = screen.getByRole('dialog')
    
    // Should close with Escape
    fireEvent.keyDown(dialog, { key: 'Escape' })
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  test('should announce state changes to screen readers', async () => {
    const TestComponent = () => {
      const { openPanel, isOpen } = useCompanionPanel()
      
      return (
        <div>
          <div aria-live="polite" data-testid="announcements">
            {isOpen ? 'Cart panel opened' : 'Cart panel closed'}
          </div>
          <button onClick={() => openPanel('cart')}>
            Open Cart
          </button>
          <CartDrawerPanel cart={mockCart} />
        </div>
      )
    }

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    expect(screen.getByTestId('announcements')).toHaveTextContent('Cart panel closed')

    fireEvent.click(screen.getByText('Open Cart'))

    await waitFor(() => {
      expect(screen.getByTestId('announcements')).toHaveTextContent('Cart panel opened')
    })
  })
})
```

### 2. E2E Accessibility Tests

```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility E2E', () => {
  test('should pass accessibility audit on panel interactions', async ({ page }) => {
    await page.goto('/products/test-product')

    // Initial page should be accessible
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])

    // Open cart panel
    await page.click('[data-testid="add-to-cart"]')
    await page.waitForSelector('[data-testid="cart-panel"]')

    // Panel should be accessible
    const panelScanResults = await new AxeBuilder({ page }).analyze()
    expect(panelScanResults.violations).toEqual([])

    // Test keyboard navigation
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter') // Should activate focused element

    // Should still be accessible after interaction
    const postInteractionResults = await new AxeBuilder({ page }).analyze()
    expect(postInteractionResults.violations).toEqual([])
  })

  test('should maintain focus management', async ({ page }) => {
    await page.goto('/products/test-product')

    const addToCartButton = page.locator('[data-testid="add-to-cart"]')
    await addToCartButton.focus()
    
    // Open panel
    await addToCartButton.click()
    
    // Focus should move to panel
    const panel = page.locator('[data-testid="cart-panel"]')
    await expect(panel).toBeFocused()
    
    // Close panel with Escape
    await page.keyboard.press('Escape')
    
    // Focus should return to trigger
    await expect(addToCartButton).toBeFocused()
  })
})
```

## 📋 Test Utilities

### 1. Custom Test Utilities

```typescript
// __tests__/utils/test-utils.tsx
import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { CompanionPanelProvider } from '@lib/context/companion-panel-context'

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <CompanionPanelProvider>
      {children}
    </CompanionPanelProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Custom matchers
export const expectPanelToBeOpen = (panelType: string) => {
  expect(screen.getByTestId(`${panelType}-panel`)).toBeInTheDocument()
}

export const expectPanelToBeClosed = (panelType: string) => {
  expect(screen.queryByTestId(`${panelType}-panel`)).not.toBeInTheDocument()
}

// Mock data generators
export const createMockCart = (itemCount: number = 1) => ({
  id: 'cart-123',
  items: Array.from({ length: itemCount }, (_, i) => ({
    id: `item-${i}`,
    title: `Product ${i}`,
    quantity: 1,
    unit_price: 1000,
    total: 1000
  })),
  subtotal: itemCount * 1000,
  total: itemCount * 1000,
  currency_code: 'usd'
})

export const createMockProduct = (id: string = 'product-1') => ({
  id,
  title: `Test Product ${id}`,
  price: 1000,
  variants: [
    { id: `variant-${id}`, title: 'Default', price: 1000 }
  ]
})
```

### 2. Test Setup Files

```typescript
// jest.setup.js
import '@testing-library/jest-dom'
import 'jest-axe/extend-expect'

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock performance.now
global.performance.now = jest.fn(() => Date.now())

// Console error suppression for expected errors in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
```

## 📊 Test Coverage

### 1. Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/lib/context/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  coverageReporters: ['text', 'lcov', 'html']
}
```

### 2. Coverage Analysis Script

```javascript
// scripts/analyze-coverage.js
const fs = require('fs')
const path = require('path')

const coverageFile = path.join(__dirname, '../coverage/coverage-summary.json')

if (!fs.existsSync(coverageFile)) {
  console.error('Coverage file not found. Run tests with --coverage first.')
  process.exit(1)
}

const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'))

console.log('\n📊 Coverage Analysis\n')

Object.entries(coverage).forEach(([file, data]) => {
  if (file === 'total') return
  
  const { lines, functions, branches, statements } = data
  
  console.log(`📁 ${file}`)
  console.log(`  Lines: ${lines.pct}%`)
  console.log(`  Functions: ${functions.pct}%`)
  console.log(`  Branches: ${branches.pct}%`)
  console.log(`  Statements: ${statements.pct}%`)
  console.log('')
})

const total = coverage.total
console.log(`🎯 Total Coverage`)
console.log(`  Lines: ${total.lines.pct}%`)
console.log(`  Functions: ${total.functions.pct}%`)
console.log(`  Branches: ${total.branches.pct}%`)
console.log(`  Statements: ${total.statements.pct}%`)
```

This comprehensive testing guide provides examples for all levels of testing in the Companion Panel System, from unit tests to end-to-end scenarios, ensuring robust and reliable functionality across all use cases.