import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import FilteredProductsClient from '../../../../../src/modules/store/components/filtered-products-container/client'
import { HttpTypes } from '@medusajs/types'

// Mock the dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}))
jest.mock('@modules/store/components/filter-sort-bar', () => {
  return function MockFilterSortBar({ onFilterChange, activeFilters }: any) {
    return (
      <div data-testid="filter-sort-bar">
        <button
          onClick={() => onFilterChange('types', ['t-shirt'])}
          data-testid="filter-button"
        >
          Filter by T-Shirt
        </button>
        <div data-testid="active-filters">
          {JSON.stringify(activeFilters)}
        </div>
      </div>
    )
  }
})

jest.mock('@modules/store/templates/paginated-products', () => {
  return function MockPaginatedProducts({ products, count }: any) {
    return (
      <div data-testid="paginated-products">
        <div data-testid="product-count">{products.length}</div>
        <div data-testid="total-count">{count}</div>
        {products.map((product: any) => (
          <div key={product.id} data-testid={`product-${product.id}`}>
            {product.title}
          </div>
        ))}
      </div>
    )
  }
})

// Mock data
const mockProducts: HttpTypes.StoreProduct[] = [
  {
    id: 'prod_1',
    title: 'Cotton T-Shirt',
    handle: 't-shirt'
  },
  {
    id: 'prod_2', 
    title: 'Wool Sweater',
    handle: 'sweater'
  }
] as any

const mockDynamicFilters = {
  tags: [
    { id: 'blue', label: 'Blue', count: 5 },
    { id: 'red', label: 'Red', count: 3 }
  ],
  types: [
    { id: 't-shirt', label: 'T-Shirt', count: 10 },
    { id: 'sweater', label: 'Sweater', count: 7 }
  ],
  materials: [
    { id: 'cotton', label: 'Cotton', count: 12 },
    { id: 'wool', label: 'Wool', count: 8 }
  ],
  sizes: [
    { id: 'S', label: 'S', count: 15 },
    { id: 'M', label: 'M', count: 20 },
    { id: 'L', label: 'L', count: 18 }
  ],
  collections: [],
  categories: [],
  priceRange: { min: 10, max: 100 }
}

const mockRegion: HttpTypes.StoreRegion = {
  id: 'reg_1',
  name: 'US',
  currency_code: 'usd'
} as any

const defaultProps = {
  sortBy: 'created_at' as const,
  page: 1,
  countryCode: 'us',
  dynamicFilters: mockDynamicFilters,
  products: mockProducts,
  count: 2,
  region: mockRegion
}

describe('FilteredProductsClient', () => {
  const mockPush = jest.fn()
  const mockGet = jest.fn()
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
  const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>
  const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>
  const originalURLSearchParams = global.URLSearchParams

  beforeEach(() => {
    jest.clearAllMocks()
    
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn()
    })

    mockGet.mockReturnValue(null)
    mockUseSearchParams.mockReturnValue({
      get: mockGet,
      getAll: jest.fn().mockReturnValue([]),
      has: jest.fn().mockReturnValue(false),
      keys: jest.fn().mockReturnValue([]),
      values: jest.fn().mockReturnValue([]),
      entries: jest.fn().mockReturnValue([]),
      toString: jest.fn().mockReturnValue(''),
      forEach: jest.fn()
    } as any)
    
    // Mock URLSearchParams constructor to work with our mock
    global.URLSearchParams = jest.fn().mockImplementation((init) => {
      // If init is our mock searchParams, return a new URLSearchParams with empty string
      if (init && typeof init === 'object' && typeof init.get === 'function') {
        return new originalURLSearchParams('')
      }
      // Otherwise use the original constructor
      return new originalURLSearchParams(init)
    }) as any

    mockUsePathname.mockReturnValue('/store')

    // Mock window.location.search for getCurrentFiltersFromActualURL
    delete (window as any).location
    window.location = {
      search: ''
    } as any
  })

  afterEach(() => {
    // Restore original URLSearchParams
    global.URLSearchParams = originalURLSearchParams
  })

  it('should render filter controls and product grid', () => {
    render(<FilteredProductsClient {...defaultProps} />)

    expect(screen.getByTestId('filter-sort-bar')).toBeInTheDocument()
    expect(screen.getByTestId('paginated-products')).toBeInTheDocument()
    expect(screen.getByTestId('product-count')).toHaveTextContent('2')
    expect(screen.getByTestId('total-count')).toHaveTextContent('2')
  })

  it.skip('should parse filters from URL search params', () => {
    mockGet
      .mockReturnValueOnce('t-shirt,sweater') // types
      .mockReturnValueOnce('blue,red')        // tags
      .mockReturnValueOnce('cotton')          // materials
      .mockReturnValueOnce('S,M')             // sizes
      .mockReturnValueOnce('10')              // price_min
      .mockReturnValueOnce('50')              // price_max

    // Also set up window.location.search for getCurrentFiltersFromActualURL
    window.location = {
      search: '?types=t-shirt,sweater&tags=blue,red&materials=cotton&sizes=S,M&price_min=10&price_max=50'
    } as any

    render(<FilteredProductsClient {...defaultProps} />)

    const activeFilters = screen.getByTestId('active-filters')
    const filterData = JSON.parse(activeFilters.textContent || '{}')

    expect(filterData.types).toEqual(['t-shirt', 'sweater'])
    expect(filterData.tags).toEqual(['blue', 'red'])
    expect(filterData.materials).toEqual(['cotton'])
    expect(filterData.sizes).toEqual(['S', 'M'])
    expect(filterData.priceRange).toEqual({ min: 10, max: 50 })
  })

  it.skip('should handle filter changes and update URL', async () => {
    const user = userEvent.setup()
    window.location.search = ''

    render(<FilteredProductsClient {...defaultProps} />)

    const filterButton = screen.getByTestId('filter-button')
    await user.click(filterButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/store?types=t-shirt&page=1')
    })
  })

  it('should preserve existing filters when adding new ones', async () => {
    const user = userEvent.setup()
    window.location.search = '?materials=cotton&sizes=M'

    render(<FilteredProductsClient {...defaultProps} />)

    const filterButton = screen.getByTestId('filter-button')
    await user.click(filterButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('materials=cotton')
      )
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('sizes=M')
      )
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('types=t-shirt')
      )
    })
  })

  it('should reset page to 1 when filters change', async () => {
    const user = userEvent.setup()
    window.location.search = '?page=3'

    const propsWithPage3 = { ...defaultProps, page: 3 }
    render(<FilteredProductsClient {...propsWithPage3} />)

    const filterButton = screen.getByTestId('filter-button')
    await user.click(filterButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('page=1')
      )
    })
  })

  it.skip('should handle empty filter arrays correctly', async () => {
    const user = userEvent.setup()
    window.location.search = '?types=t-shirt'

    // Mock filter change that clears types
    const FilterSortBarWithClear = ({ onFilterChange, activeFilters }: any) => (
      <div data-testid="filter-sort-bar">
        <button
          onClick={() => onFilterChange('types', [])}
          data-testid="clear-filter-button"
        >
          Clear Types
        </button>
        <div data-testid="active-filters">
          {JSON.stringify(activeFilters)}
        </div>
      </div>
    )

    jest.doMock('@modules/store/components/filter-sort-bar', () => FilterSortBarWithClear)

    const { rerender } = render(<FilteredProductsClient {...defaultProps} />)
    
    // Force re-render with new mock
    rerender(<FilteredProductsClient {...defaultProps} />)

    const clearButton = screen.getByTestId('clear-filter-button')
    await user.click(clearButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.not.stringContaining('types=')
      )
    })
  })

  it.skip('should synchronize state with URL changes', () => {
    const { rerender } = render(<FilteredProductsClient {...defaultProps} />)

    // Simulate URL change
    mockGet
      .mockReturnValueOnce('sweater') // types
      .mockReturnValueOnce(null)      // tags  
      .mockReturnValueOnce(null)      // materials
      .mockReturnValueOnce(null)      // sizes
      .mockReturnValueOnce(null)      // price_min
      .mockReturnValueOnce(null)      // price_max

    rerender(<FilteredProductsClient {...defaultProps} />)

    const activeFilters = screen.getByTestId('active-filters')
    const filterData = JSON.parse(activeFilters.textContent || '{}')

    expect(filterData.types).toEqual(['sweater'])
    expect(filterData.tags).toEqual([])
    expect(filterData.materials).toEqual([])
    expect(filterData.sizes).toEqual([])
  })

  it.skip('should handle price range filters', () => {
    mockGet
      .mockReturnValueOnce(null)  // types
      .mockReturnValueOnce(null)  // tags
      .mockReturnValueOnce(null)  // materials  
      .mockReturnValueOnce(null)  // sizes
      .mockReturnValueOnce('25')  // price_min
      .mockReturnValueOnce('75')  // price_max

    render(<FilteredProductsClient {...defaultProps} />)

    const activeFilters = screen.getByTestId('active-filters')
    const filterData = JSON.parse(activeFilters.textContent || '{}')

    expect(filterData.priceRange).toEqual({ min: 25, max: 75 })
  })

  it.skip('should handle malformed URL parameters gracefully', () => {
    mockGet
      .mockReturnValueOnce('invalid,,filter,')  // types with empty values
      .mockReturnValueOnce('')                   // empty tags
      .mockReturnValueOnce(null)                 // null materials
      .mockReturnValueOnce('S,,M,')              // sizes with empty values
      .mockReturnValueOnce('not-a-number')      // invalid price_min
      .mockReturnValueOnce('75')                 // valid price_max

    render(<FilteredProductsClient {...defaultProps} />)

    const activeFilters = screen.getByTestId('active-filters')
    const filterData = JSON.parse(activeFilters.textContent || '{}')

    // Should filter out empty values and handle invalid numbers
    expect(filterData.types).toEqual(['invalid', 'filter'])
    expect(filterData.tags).toEqual([])
    expect(filterData.sizes).toEqual(['S', 'M'])
    expect(filterData.priceRange).toBeUndefined() // Invalid min should result in no price range
  })

  it('should display title when provided', () => {
    const propsWithTitle = { ...defaultProps, title: 'Test Collection' }
    render(<FilteredProductsClient {...propsWithTitle} />)

    expect(screen.getByText('Test Collection')).toBeInTheDocument()
    expect(screen.getByTestId('store-page-title')).toBeInTheDocument()
  })

  it('should not display title when not provided', () => {
    render(<FilteredProductsClient {...defaultProps} />)

    expect(screen.queryByTestId('store-page-title')).not.toBeInTheDocument()
  })

  it('should pass correct props to PaginatedProducts', () => {
    render(<FilteredProductsClient {...defaultProps} />)

    expect(screen.getByTestId('product-prod_1')).toHaveTextContent('Cotton T-Shirt')
    expect(screen.getByTestId('product-prod_2')).toHaveTextContent('Wool Sweater')
    expect(screen.getByTestId('product-count')).toHaveTextContent('2')
    expect(screen.getByTestId('total-count')).toHaveTextContent('2')
  })
})

describe('FilteredProductsClient - URL State Management', () => {
  const mockPush = jest.fn()
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
  const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>
  const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

  beforeEach(() => {
    jest.clearAllMocks()
    
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn()
    })

    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null)
    } as any)

    mockUsePathname.mockReturnValue('/store')

    delete (window as any).location
    window.location = { search: '' } as any
  })

  it.skip('should create correct query string with multiple filters', async () => {
    const user = userEvent.setup()
    window.location.search = '?materials=cotton&sizes=M,L'

    // Mock filter change that adds types
    const FilterSortBarWithMultiple = ({ onFilterChange }: any) => (
      <button
        onClick={() => onFilterChange('types', ['t-shirt', 'sweater'])}
        data-testid="multi-filter-button"
      >
        Add Multiple Types
      </button>
    )

    jest.doMock('@modules/store/components/filter-sort-bar', () => FilterSortBarWithMultiple)

    const { rerender } = render(<FilteredProductsClient {...defaultProps} />)
    rerender(<FilteredProductsClient {...defaultProps} />)

    const button = screen.getByTestId('multi-filter-button')
    await user.click(button)

    await waitFor(() => {
      const lastCall = mockPush.mock.calls[mockPush.mock.calls.length - 1][0]
      expect(lastCall).toContain('materials=cotton')
      expect(lastCall).toContain('sizes=M%2CL')  // URL encoded comma
      expect(lastCall).toContain('types=t-shirt%2Csweater')
      expect(lastCall).toContain('page=1')
    })
  })

  it.skip('should handle URL encoding correctly', async () => {
    const user = userEvent.setup()
    window.location.search = ''

    // Mock filter change with special characters
    const FilterSortBarWithSpecialChars = ({ onFilterChange }: any) => (
      <button
        onClick={() => onFilterChange('tags', ['red & blue', 'black/white'])}
        data-testid="special-chars-button"
      >
        Add Special Characters
      </button>
    )

    jest.doMock('@modules/store/components/filter-sort-bar', () => FilterSortBarWithSpecialChars)

    const { rerender } = render(<FilteredProductsClient {...defaultProps} />)
    rerender(<FilteredProductsClient {...defaultProps} />)

    const button = screen.getByTestId('special-chars-button')
    await user.click(button)

    await waitFor(() => {
      const lastCall = mockPush.mock.calls[mockPush.mock.calls.length - 1][0]
      expect(lastCall).toContain('tags=')
      // Should be properly URL encoded
      expect(lastCall).toMatch(/tags=[^&]*%26[^&]*/) // Contains encoded &
    })
  })
})