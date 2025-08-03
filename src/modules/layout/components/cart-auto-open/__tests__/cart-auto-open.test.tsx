import { render } from '@testing-library/react'
import CartAutoOpen from '../index'

// Mock the companion panel context
const mockOpenPanel = jest.fn()
const mockClosePanel = jest.fn()

jest.mock('@lib/context/companion-panel-context', () => ({
  useCompanionPanel: () => ({
    openPanel: mockOpenPanel,
    closePanel: mockClosePanel,
    isMobile: false,
    isOpen: false,
    currentPanel: null,
  })
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/store'
}))

describe('CartAutoOpen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render without crashing', () => {
    const cart = {
      items: [{ id: '1', quantity: 1 }]
    }

    expect(() => {
      render(<CartAutoOpen cart={cart} autoOpenDuration={4000} />)
    }).not.toThrow()
  })

  it('should not render any visible content', () => {
    const cart = {
      items: [{ id: '1', quantity: 1 }]
    }

    const { container } = render(
      <CartAutoOpen cart={cart} autoOpenDuration={4000} />
    )

    // CartAutoOpen should render nothing (just side effects)
    expect(container.firstChild).toBeNull()
  })

  it('should respect disabled prop', () => {
    const cart = {
      items: [{ id: '1', quantity: 1 }]
    }

    render(
      <CartAutoOpen 
        cart={cart} 
        disabled={true}
        autoOpenDuration={1000}
      />
    )

    // With disabled=true, should not call openPanel
    expect(mockOpenPanel).not.toHaveBeenCalled()
  })
})