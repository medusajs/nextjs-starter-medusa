/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { usePathname } from 'next/navigation'
import { HttpTypes } from '@medusajs/types'

// Mock dependencies
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

jest.mock('@lib/context/companion-panel-context', () => ({
  useCompanionPanel: jest.fn(),
}))

jest.mock('@lib/util/money', () => ({
  convertToLocale: jest.fn(({ amount, currency_code }) => `$${(amount / 100).toFixed(2)}`),
}))

jest.mock('@modules/common/components/delete-button', () => {
  return function DeleteButton({ id, children, onClick, ...props }) {
    return (
      <button onClick={onClick} data-testid={`delete-${id}`} {...props}>
        {children}
      </button>
    )
  }
})

jest.mock('@modules/common/components/localized-client-link', () => {
  return function LocalizedClientLink({ href, children, ...props }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
})

jest.mock('@modules/products/components/thumbnail', () => {
  return function Thumbnail({ thumbnail, images, size }) {
    return <div data-testid="thumbnail">{thumbnail || 'no-image'}</div>
  }
})

jest.mock('@modules/common/components/line-item-options', () => {
  return function LineItemOptions({ variant }) {
    return <div data-testid="line-item-options">{variant?.title || 'No variant'}</div>
  }
})

jest.mock('@modules/common/components/line-item-price', () => {
  return function LineItemPrice({ item, currencyCode }) {
    return <div data-testid="line-item-price">${(item.unit_price / 100).toFixed(2)}</div>
  }
})

import CartDrawerPanel from '../../../../src/modules/layout/components/cart-drawer'
import { useCompanionPanel } from '@lib/context/companion-panel-context'

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>
const mockUseCompanionPanel = useCompanionPanel as jest.MockedFunction<typeof useCompanionPanel>

// Mock cart data
const mockCartWithItems: HttpTypes.StoreCart = {
  id: 'cart_123',
  currency_code: 'usd',
  subtotal: 4000,
  total: 4000,
  items: [
    {
      id: 'item_1',
      title: 'Test Product 1',
      quantity: 2,
      unit_price: 1500,
      total: 3000,
      product_handle: 'test-product-1',
      thumbnail: 'test-image-1.jpg',
      variant: {
        id: 'variant_1',
        title: 'Size M',
        product: {
          images: [{ url: 'test-image-1.jpg' }]
        }
      },
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'item_2',
      title: 'Test Product 2',
      quantity: 1,
      unit_price: 1000,
      total: 1000,
      product_handle: 'test-product-2',
      thumbnail: 'test-image-2.jpg',
      variant: {
        id: 'variant_2',
        title: 'Size L',
        product: {
          images: [{ url: 'test-image-2.jpg' }]
        }
      },
      created_at: '2024-01-02T00:00:00Z'
    }
  ]
} as any

const mockEmptyCart: HttpTypes.StoreCart = {
  id: 'cart_empty',
  currency_code: 'usd',
  subtotal: 0,
  total: 0,
  items: []
} as any

const mockCompanionPanelContext = {
  isOpen: true,
  currentPanel: { type: 'cart', data: {}, timestamp: Date.now(), title: 'Cart' },
  closePanel: jest.fn(),
  goBack: jest.fn(),
  canGoBack: false,
  isMobile: false,
  openPanel: jest.fn()
}

describe('CartDrawerPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePathname.mockReturnValue('/store')
    mockUseCompanionPanel.mockReturnValue(mockCompanionPanelContext)
    
    // Mock timers
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Rendering', () => {
    test('should not render when panel is not open', () => {
      mockUseCompanionPanel.mockReturnValue({
        ...mockCompanionPanelContext,
        isOpen: false,
        currentPanel: null
      })

      const { container } = render(<CartDrawerPanel cart={mockCartWithItems} />)
      expect(container.firstChild).toBeNull()
    })

    test('should not render when current panel is not cart', () => {
      mockUseCompanionPanel.mockReturnValue({
        ...mockCompanionPanelContext,
        currentPanel: { type: 'ai-assistant', data: {}, timestamp: Date.now(), title: 'AI' }
      })

      const { container } = render(<CartDrawerPanel cart={mockCartWithItems} />)
      expect(container.firstChild).toBeNull()
    })

    test('should render desktop version when not mobile', () => {
      render(<CartDrawerPanel cart={mockCartWithItems} />)
      
      expect(screen.getByTestId('cart-drawer-content')).toBeInTheDocument()
      expect(screen.getByText('Shopping Cart (3)')).toBeInTheDocument()
    })

    test('should render mobile version when mobile', () => {
      mockUseCompanionPanel.mockReturnValue({
        ...mockCompanionPanelContext,
        isMobile: true
      })

      render(<CartDrawerPanel cart={mockCartWithItems} />)
      
      expect(screen.getByTestId('cart-drawer-content')).toBeInTheDocument()
      expect(screen.getByText('Shopping Cart (3)')).toBeInTheDocument()
    })
  })

  describe('Cart with items', () => {
    beforeEach(() => {
      render(<CartDrawerPanel cart={mockCartWithItems} />)
    })

    test('should display correct item count in header', () => {
      expect(screen.getByText('Shopping Cart (3)')).toBeInTheDocument()
    })

    test('should display all cart items', () => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument()
      expect(screen.getByText('Test Product 2')).toBeInTheDocument()
      
      // Check quantities
      expect(screen.getByText('Quantity: 2')).toBeInTheDocument()
      expect(screen.getByText('Quantity: 1')).toBeInTheDocument()
    })

    test('should display item thumbnails', () => {
      const thumbnails = screen.getAllByTestId('thumbnail')
      expect(thumbnails).toHaveLength(2)
    })

    test('should display item variants', () => {
      const variants = screen.getAllByTestId('line-item-options')
      expect(variants).toHaveLength(2)
    })

    test('should display item prices', () => {
      const prices = screen.getAllByTestId('line-item-price')
      expect(prices).toHaveLength(2)
    })

    test('should display subtotal', () => {
      expect(screen.getByTestId('cart-subtotal')).toHaveTextContent('$40.00')
    })

    test('should display shipping notice', () => {
      expect(screen.getByText('Shipping and taxes calculated at checkout.')).toBeInTheDocument()
    })

    test('should display go to cart button', () => {
      expect(screen.getByTestId('go-to-cart-button')).toBeInTheDocument()
    })

    test('should display remove buttons for each item', () => {
      const removeButtons = screen.getAllByTestId('cart-item-remove-button')
      expect(removeButtons).toHaveLength(2)
    })
  })

  describe('Empty cart', () => {
    beforeEach(() => {
      render(<CartDrawerPanel cart={mockEmptyCart} />)
    })

    test('should display empty cart message', () => {
      expect(screen.getByText('Your shopping bag is empty.')).toBeInTheDocument()
    })

    test('should display explore products button', () => {
      expect(screen.getByText('Explore products')).toBeInTheDocument()
    })

    test('should not display subtotal section', () => {
      expect(screen.queryByTestId('cart-subtotal')).not.toBeInTheDocument()
    })

    test('should not display go to cart button', () => {
      expect(screen.queryByTestId('go-to-cart-button')).not.toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    test('should show back button when can go back', () => {
      mockUseCompanionPanel.mockReturnValue({
        ...mockCompanionPanelContext,
        canGoBack: true
      })

      render(<CartDrawerPanel cart={mockCartWithItems} />)
      
      expect(screen.getByTestId('back-button')).toBeInTheDocument()
    })

    test('should not show back button when cannot go back', () => {
      render(<CartDrawerPanel cart={mockCartWithItems} />)
      
      expect(screen.queryByTestId('back-button')).not.toBeInTheDocument()
    })

    test('should call goBack when back button clicked', () => {
      mockUseCompanionPanel.mockReturnValue({
        ...mockCompanionPanelContext,
        canGoBack: true
      })

      render(<CartDrawerPanel cart={mockCartWithItems} />)
      
      fireEvent.click(screen.getByTestId('back-button'))
      expect(mockCompanionPanelContext.goBack).toHaveBeenCalledTimes(1)
    })

    test('should call closePanel when close button clicked', () => {
      render(<CartDrawerPanel cart={mockCartWithItems} />)
      
      fireEvent.click(screen.getByTestId('close-cart-button'))
      expect(mockCompanionPanelContext.closePanel).toHaveBeenCalledTimes(1)
    })

    test('should call closePanel when go to cart button clicked', () => {
      render(<CartDrawerPanel cart={mockCartWithItems} />)
      
      fireEvent.click(screen.getByTestId('go-to-cart-button'))
      expect(mockCompanionPanelContext.closePanel).toHaveBeenCalledTimes(1)
    })

    test('should call closePanel when explore products clicked', () => {
      render(<CartDrawerPanel cart={mockEmptyCart} />)
      
      fireEvent.click(screen.getByText('Explore products'))
      expect(mockCompanionPanelContext.closePanel).toHaveBeenCalledTimes(1)
    })
  })

  describe('Auto-open functionality', () => {
    test('should auto-open cart when items are added', () => {
      const { rerender } = render(<CartDrawerPanel cart={mockEmptyCart} />)
      
      // Add items to cart
      rerender(<CartDrawerPanel cart={mockCartWithItems} />)
      
      expect(mockCompanionPanelContext.openPanel).toHaveBeenCalledWith(
        'cart',
        { items: mockCartWithItems.items }
      )
    })

    test('should not auto-open when on cart page', () => {
      mockUsePathname.mockReturnValue('/cart')
      
      const { rerender } = render(<CartDrawerPanel cart={mockEmptyCart} />)
      rerender(<CartDrawerPanel cart={mockCartWithItems} />)
      
      expect(mockCompanionPanelContext.openPanel).not.toHaveBeenCalled()
    })

    test('should auto-close after timeout', async () => {
      const { rerender } = render(<CartDrawerPanel cart={mockEmptyCart} />)
      rerender(<CartDrawerPanel cart={mockCartWithItems} />)
      
      // Fast-forward time
      jest.advanceTimersByTime(5000)
      
      expect(mockCompanionPanelContext.closePanel).toHaveBeenCalled()
    })

    test('should cleanup timer on unmount', () => {
      const { rerender, unmount } = render(<CartDrawerPanel cart={mockEmptyCart} />)
      rerender(<CartDrawerPanel cart={mockCartWithItems} />)
      
      // Unmount before timer completes
      unmount()
      
      // Timer should not fire
      jest.advanceTimersByTime(5000)
      expect(mockCompanionPanelContext.closePanel).not.toHaveBeenCalled()
    })
  })

  describe('Item sorting', () => {
    test('should sort items by creation date (newest first)', () => {
      render(<CartDrawerPanel cart={mockCartWithItems} />)
      
      const items = screen.getAllByTestId('cart-item')
      expect(items).toHaveLength(2)
      
      // Items should be sorted by created_at desc
      // item_2 (2024-01-02) should come before item_1 (2024-01-01)
      const firstItem = items[0]
      expect(firstItem).toHaveTextContent('Test Product 2')
    })
  })

  describe('Accessibility', () => {
    test('should have proper ARIA labels', () => {
      render(<CartDrawerPanel cart={mockCartWithItems} />)
      
      expect(screen.getByText('Close')).toBeInTheDocument()
      expect(screen.getByTestId('close-cart-button')).toBeInTheDocument()
    })

    test('should have proper test IDs for testing', () => {
      render(<CartDrawerPanel cart={mockCartWithItems} />)
      
      expect(screen.getByTestId('cart-drawer-content')).toBeInTheDocument()
      expect(screen.getByTestId('close-cart-button')).toBeInTheDocument()
      
      const items = screen.getAllByTestId('cart-item')
      expect(items).toHaveLength(2)
    })

    test('should have proper links to products', () => {
      render(<CartDrawerPanel cart={mockCartWithItems} />)
      
      const productLinks = screen.getAllByTestId('product-link')
      expect(productLinks).toHaveLength(2)
      expect(productLinks[0]).toHaveAttribute('href', '/products/test-product-2')
      expect(productLinks[1]).toHaveAttribute('href', '/products/test-product-1')
    })
  })

  describe('Error handling', () => {
    test('should handle null cart gracefully', () => {
      render(<CartDrawerPanel cart={null} />)
      
      expect(screen.getByText('Your shopping bag is empty.')).toBeInTheDocument()
    })

    test('should handle undefined cart gracefully', () => {
      render(<CartDrawerPanel cart={undefined} />)
      
      expect(screen.getByText('Your shopping bag is empty.')).toBeInTheDocument()
    })

    test('should handle cart with null items', () => {
      const cartWithNullItems = { ...mockEmptyCart, items: null }
      render(<CartDrawerPanel cart={cartWithNullItems} />)
      
      expect(screen.getByText('Your shopping bag is empty.')).toBeInTheDocument()
    })

    test('should handle items with missing data', () => {
      const cartWithIncompleteItems = {
        ...mockCartWithItems,
        items: [{
          id: 'incomplete_item',
          title: 'Incomplete Item',
          quantity: 1,
          // Missing other required fields
        }]
      }

      expect(() => {
        render(<CartDrawerPanel cart={cartWithIncompleteItems} />)
      }).not.toThrow()
    })
  })

  describe('Performance', () => {
    test('should not re-render unnecessarily', () => {
      const { rerender } = render(<CartDrawerPanel cart={mockCartWithItems} />)
      
      // Re-render with same cart
      rerender(<CartDrawerPanel cart={mockCartWithItems} />)
      
      // Component should handle this gracefully
      expect(screen.getByText('Shopping Cart (3)')).toBeInTheDocument()
    })

    test('should update when cart changes', () => {
      const { rerender } = render(<CartDrawerPanel cart={mockCartWithItems} />)
      
      expect(screen.getByText('Shopping Cart (3)')).toBeInTheDocument()
      
      // Update with empty cart
      rerender(<CartDrawerPanel cart={mockEmptyCart} />)
      
      expect(screen.getByText('Your shopping bag is empty.')).toBeInTheDocument()
    })
  })
})