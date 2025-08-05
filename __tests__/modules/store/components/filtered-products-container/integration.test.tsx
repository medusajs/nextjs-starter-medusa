import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import FilteredProductsClient from '../../../../../src/modules/store/components/filtered-products-container/client'
import { HttpTypes } from '@medusajs/types'

// Mock the complete filter workflow
jest.mock('next/navigation')

// Mock FilterSortBar with realistic behavior
jest.mock('@modules/store/components/filter-sort-bar', () => {
  return function MockFilterSortBar({ 
    dynamicFilters, 
    activeFilters, 
    onFilterChange,
    sortBy 
  }: any) {
    const activeCount = Object.values(activeFilters).reduce(
      (count: number, filters: any) => count + (Array.isArray(filters) ? filters.length : 0), 
      0
    )

    return (
      <div data-testid="filter-sort-bar">
        <div data-testid="active-filter-count">{activeCount}</div>
        <div data-testid="current-sort">{sortBy}</div>
        
        {/* Mock filter controls */}
        <div data-testid="filter-controls">
          <button
            onClick={() => onFilterChange('types', ['t-shirt'])}
            data-testid="select-tshirt"
          >
            Select T-Shirt
          </button>
          <button
            onClick={() => onFilterChange('materials', ['cotton'])}
            data-testid="select-cotton"
          >
            Select Cotton
          </button>
          <button
            onClick={() => onFilterChange('sizes', ['M', 'L'])}
            data-testid="select-sizes"
          >
            Select M & L
          </button>
          <button
            onClick={() => onFilterChange('priceRange', { min: 20, max: 80 })}
            data-testid="select-price-range"
          >
            Set Price Range
          </button>
          <button
            onClick={() => onFilterChange('types', [])}
            data-testid="clear-types"
          >
            Clear Types
          </button>
        </div>

        {/* Display available filters */}
        <div data-testid="available-filters">
          {dynamicFilters && (
            <>
              <div data-testid="types-count">{dynamicFilters.types?.length || 0}</div>
              <div data-testid="materials-count">{dynamicFilters.materials?.length || 0}</div>
              <div data-testid="sizes-count">{dynamicFilters.sizes?.length || 0}</div>
            </>
          )}
        </div>
      </div>
    )
  }
})

// Mock PaginatedProducts with realistic behavior
jest.mock('@modules/store/templates/paginated-products', () => {
  return function MockPaginatedProducts({ products, count, page, region }: any) {
    return (
      <div data-testid="paginated-products">
        <div data-testid="pagination-info">
          <span data-testid="current-page">{page}</span>
          <span data-testid="product-count">{products.length}</span>
          <span data-testid="total-count">{count}</span>
        </div>
        
        <div data-testid="product-grid">
          {products.map((product: any, index: number) => (
            <div 
              key={product.id} 
              data-testid={`product-${product.id}`}
              data-product-handle={product.handle}
              data-product-index={index}
            >
              <h3>{product.title}</h3>
              <p>Handle: {product.handle}</p>
              {product.material && <p>Material: {product.material}</p>}
              {product.variants && (
                <div data-testid={`variants-${product.id}`}>
                  {product.variants.map((variant: any) => (
                    <span key={variant.id} data-testid={`variant-${variant.id}`}>
                      {variant.options?.map((opt: any) => opt.value).join(', ')}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div data-testid="no-products">No products found</div>
        )}
      </div>
    )
  }
})

// Comprehensive mock data
const mockProducts: HttpTypes.StoreProduct[] = [
  {
    id: 'prod_1',
    title: 'Cotton T-Shirt Blue',
    handle: 't-shirt',
    material: 'cotton',
    tags: [{ id: 'tag_1', value: 'blue' }],
    variants: [
      {
        id: 'var_1',
        title: 'Medium',
        options: [{ id: 'opt_1', value: 'M' }],
        calculated_price: { calculated_amount: 2500 }
      },
      {
        id: 'var_2',
        title: 'Large', 
        options: [{ id: 'opt_2', value: 'L' }],
        calculated_price: { calculated_amount: 2500 }
      }
    ]
  },
  {
    id: 'prod_2',
    title: 'Polyester Sweatshirt Red',
    handle: 'sweatshirt',
    material: 'polyester',
    tags: [{ id: 'tag_2', value: 'red' }],
    variants: [
      {
        id: 'var_3',
        title: 'Small',
        options: [{ id: 'opt_3', value: 'S' }],
        calculated_price: { calculated_amount: 4000 }
      },
      {
        id: 'var_4',
        title: 'Medium',
        options: [{ id: 'opt_4', value: 'M' }], 
        calculated_price: { calculated_amount: 4000 }
      }
    ]
  },
  {
    id: 'prod_3',
    title: 'Cotton Jeans Blue',
    handle: 'jeans',
    material: 'cotton',
    tags: [{ id: 'tag_3', value: 'blue' }],
    variants: [
      {
        id: 'var_5',
        title: 'Large',
        options: [{ id: 'opt_5', value: 'L' }],
        calculated_price: { calculated_amount: 6000 }
      }
    ]
  },
  {
    id: 'prod_4', 
    title: 'Wool Sweater Green',
    handle: 'sweater',
    material: 'wool',
    tags: [{ id: 'tag_4', value: 'green' }],
    variants: [
      {
        id: 'var_6',
        title: 'Extra Large',
        options: [{ id: 'opt_6', value: 'XL' }],
        calculated_price: { calculated_amount: 8000 }
      }
    ]
  }
] as any

const mockDynamicFilters = {
  tags: [
    { id: 'blue', label: 'Blue', count: 2 },
    { id: 'red', label: 'Red', count: 1 },
    { id: 'green', label: 'Green', count: 1 }
  ],
  types: [
    { id: 't-shirt', label: 'T-Shirt', count: 1 },
    { id: 'sweatshirt', label: 'Sweatshirt', count: 1 },
    { id: 'jeans', label: 'Jeans', count: 1 },
    { id: 'sweater', label: 'Sweater', count: 1 }
  ],
  materials: [
    { id: 'cotton', label: 'Cotton', count: 2 },
    { id: 'polyester', label: 'Polyester', count: 1 },
    { id: 'wool', label: 'Wool', count: 1 }
  ],
  sizes: [
    { id: 'S', label: 'S', count: 1 },
    { id: 'M', label: 'M', count: 2 },
    { id: 'L', label: 'L', count: 2 },
    { id: 'XL', label: 'XL', count: 1 }
  ],
  collections: [],
  categories: [],
  priceRange: { min: 25, max: 80 }
}

const mockRegion: HttpTypes.StoreRegion = {
  id: 'reg_1',
  name: 'US',
  currency_code: 'usd'
} as any

describe('Filter System Integration Tests', () => {
  const mockPush = jest.fn()
  const mockGet = jest.fn()
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
      get: mockGet
    } as any)

    mockUsePathname.mockReturnValue('/store')

    delete (window as any).location
    window.location = { search: '' } as any
  })

  it('should complete full filter workflow: select → URL update → display', async () => {
    const user = userEvent.setup()
    mockGet.mockReturnValue(null) // No initial filters

    render(
      <FilteredProductsClient
        sortBy="created_at"
        page={1}
        countryCode="us"
        dynamicFilters={mockDynamicFilters}
        products={mockProducts}
        count={4}
        region={mockRegion}
      />
    )

    // Initial state: all products visible
    expect(screen.getByTestId('product-count')).toHaveTextContent('4')
    expect(screen.getByTestId('active-filter-count')).toHaveTextContent('0')

    // Step 1: Select T-Shirt filter
    const selectTShirt = screen.getByTestId('select-tshirt')
    await user.click(selectTShirt)

    // Step 2: Verify URL update was called
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('types=t-shirt')
      )
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('page=1')
      )
    })

    // Step 3: Simulate URL change and re-render with filtered data
    mockGet
      .mockReturnValueOnce('t-shirt') // types
      .mockReturnValueOnce(null)      // tags
      .mockReturnValueOnce(null)      // materials
      .mockReturnValueOnce(null)      // sizes
      .mockReturnValueOnce(null)      // price_min
      .mockReturnValueOnce(null)      // price_max

    // Filter products to only t-shirts (simulating server-side filtering)
    const filteredProducts = mockProducts.filter(p => p.handle === 't-shirt')

    const { rerender } = render(
      <FilteredProductsClient
        sortBy="created_at"
        page={1}
        countryCode="us"
        dynamicFilters={mockDynamicFilters}
        products={filteredProducts} // Server returns filtered products
        count={1}
        region={mockRegion}
      />
    )

    // Step 4: Verify filtered display
    expect(screen.getByTestId('product-count')).toHaveTextContent('1')
    expect(screen.getByTestId('total-count')).toHaveTextContent('1')
    expect(screen.getByTestId('active-filter-count')).toHaveTextContent('1')
    expect(screen.getByTestId('product-prod_1')).toBeInTheDocument()
    expect(screen.queryByTestId('product-prod_2')).not.toBeInTheDocument()
  })

  it('should handle multiple filter selections correctly', async () => {
    const user = userEvent.setup()
    mockGet.mockReturnValue(null)

    render(
      <FilteredProductsClient
        sortBy="created_at"
        page={1}
        countryCode="us"
        dynamicFilters={mockDynamicFilters}
        products={mockProducts}
        count={4}
        region={mockRegion}
      />
    )

    // Select multiple filters
    await user.click(screen.getByTestId('select-cotton'))
    await user.click(screen.getByTestId('select-sizes'))

    await waitFor(() => {
      // Should combine filters in URL
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringMatching(/materials=cotton.*sizes=M%2CL|sizes=M%2CL.*materials=cotton/)
      )
    })
  })

  it('should maintain filter state across page changes', async () => {
    const user = userEvent.setup()
    
    // Start with existing filters in URL
    mockGet
      .mockReturnValueOnce('t-shirt,jeans') // types
      .mockReturnValueOnce(null)            // tags
      .mockReturnValueOnce('cotton')        // materials
      .mockReturnValueOnce(null)            // sizes
      .mockReturnValueOnce(null)            // price_min
      .mockReturnValueOnce(null)            // price_max

    render(
      <FilteredProductsClient
        sortBy="created_at"
        page={1}
        countryCode="us"
        dynamicFilters={mockDynamicFilters}
        products={mockProducts.filter(p => 
          ['t-shirt', 'jeans'].includes(p.handle) && p.material === 'cotton'
        )}
        count={2}
        region={mockRegion}
      />
    )

    // Should show active filters
    expect(screen.getByTestId('active-filter-count')).toHaveTextContent('3') // 2 types + 1 material

    // Add another filter
    await user.click(screen.getByTestId('select-sizes'))

    await waitFor(() => {
      // Should preserve existing filters and add new one
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('types=t-shirt%2Cjeans')
      )
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('materials=cotton')
      )
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('sizes=M%2CL')
      )
    })
  })

  it('should handle filter removal correctly', async () => {
    const user = userEvent.setup()

    // Start with filters active
    mockGet
      .mockReturnValueOnce('t-shirt,sweatshirt') // types
      .mockReturnValueOnce(null)                 // tags
      .mockReturnValueOnce('cotton')             // materials
      .mockReturnValueOnce('M,L')                // sizes
      .mockReturnValueOnce(null)                 // price_min
      .mockReturnValueOnce(null)                 // price_max

    render(
      <FilteredProductsClient
        sortBy="created_at"
        page={1}
        countryCode="us"
        dynamicFilters={mockDynamicFilters}
        products={mockProducts}
        count={4}
        region={mockRegion}
      />
    )

    expect(screen.getByTestId('active-filter-count')).toHaveTextContent('5') // 2+1+2

    // Clear types filter
    await user.click(screen.getByTestId('clear-types'))

    await waitFor(() => {
      // Should remove types but keep other filters
      expect(mockPush).toHaveBeenCalledWith(
        expect.not.stringContaining('types=')
      )
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('materials=cotton')
      )
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('sizes=M%2CL')
      )
    })
  })

  it('should reset page to 1 when filters change', async () => {
    const user = userEvent.setup()
    mockGet.mockReturnValue(null)

    render(
      <FilteredProductsClient
        sortBy="created_at"
        page={3} // Start on page 3
        countryCode="us"
        dynamicFilters={mockDynamicFilters}
        products={mockProducts}
        count={4}
        region={mockRegion}
      />
    )

    expect(screen.getByTestId('current-page')).toHaveTextContent('3')

    // Apply filter
    await user.click(screen.getByTestId('select-cotton'))

    await waitFor(() => {
      // Should reset to page 1
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('page=1')
      )
    })
  })

  it('should handle price range filters', async () => {
    const user = userEvent.setup()
    mockGet.mockReturnValue(null)

    render(
      <FilteredProductsClient
        sortBy="created_at"
        page={1}
        countryCode="us"
        dynamicFilters={mockDynamicFilters}
        products={mockProducts}
        count={4}
        region={mockRegion}
      />
    )

    // Set price range
    await user.click(screen.getByTestId('select-price-range'))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('price_min=20')
      )
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('price_max=80')
      )
    })
  })

  it('should display correct filter availability', () => {
    mockGet.mockReturnValue(null)

    render(
      <FilteredProductsClient
        sortBy="created_at"
        page={1}
        countryCode="us"
        dynamicFilters={mockDynamicFilters}
        products={mockProducts}
        count={4}
        region={mockRegion}
      />
    )

    // Should show available filter counts
    expect(screen.getByTestId('types-count')).toHaveTextContent('4')
    expect(screen.getByTestId('materials-count')).toHaveTextContent('3')
    expect(screen.getByTestId('sizes-count')).toHaveTextContent('4')
  })

  it('should handle empty search results', () => {
    mockGet.mockReturnValue(null)

    render(
      <FilteredProductsClient
        sortBy="created_at"
        page={1}
        countryCode="us"
        dynamicFilters={mockDynamicFilters}
        products={[]} // No products
        count={0}
        region={mockRegion}
      />
    )

    expect(screen.getByTestId('no-products')).toBeInTheDocument()
    expect(screen.getByTestId('product-count')).toHaveTextContent('0')
    expect(screen.getByTestId('total-count')).toHaveTextContent('0')
  })

  it('should handle sort changes while maintaining filters', async () => {
    const user = userEvent.setup()
    
    // Start with active filters
    mockGet
      .mockReturnValueOnce('cotton') // materials
      .mockReturnValueOnce(null)     // tags
      .mockReturnValueOnce(null)     // types
      .mockReturnValueOnce(null)     // sizes
      .mockReturnValueOnce(null)     // price_min
      .mockReturnValueOnce(null)     // price_max

    render(
      <FilteredProductsClient
        sortBy="created_at"
        page={1}
        countryCode="us"
        dynamicFilters={mockDynamicFilters}
        products={mockProducts.filter(p => p.material === 'cotton')}
        count={2}
        region={mockRegion}
      />
    )

    expect(screen.getByTestId('current-sort')).toHaveTextContent('created_at')
    expect(screen.getByTestId('active-filter-count')).toHaveTextContent('1')

    // Sort should be maintained when filters change
    await user.click(screen.getByTestId('select-tshirt'))

    await waitFor(() => {
      // Should maintain existing material filter
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('materials=cotton')
      )
      // Should add new type filter
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('types=t-shirt')
      )
    })
  })
})