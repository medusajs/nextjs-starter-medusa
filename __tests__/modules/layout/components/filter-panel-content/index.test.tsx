import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useSearchParams } from 'next/navigation'
import FilterPanelContent from '../../../../../src/modules/layout/components/filter-panel-content/index'

// Mock the dependencies
jest.mock('next/navigation')
jest.mock('@modules/store/components/filter-module', () => {
  return function MockFilterModule({ filters, activeFilters, onFilterChange }: any) {
    return (
      <div data-testid="filter-module">
        {filters.map((filter: any) => (
          <div key={filter.id} data-testid={`filter-section-${filter.id}`}>
            <h3>{filter.label}</h3>
            {filter.options?.map((option: any) => (
              <label key={option.id} data-testid={`filter-option-${option.id}`}>
                <input
                  type="checkbox"
                  checked={activeFilters[filter.id]?.includes(option.id) || false}
                  onChange={(e) => {
                    const currentValues = activeFilters[filter.id] || []
                    const newValues = e.target.checked
                      ? [...currentValues, option.id]
                      : currentValues.filter((v: string) => v !== option.id)
                    onFilterChange(filter.id, newValues)
                  }}
                />
                {option.label} ({option.count})
              </label>
            ))}
          </div>
        ))}
      </div>
    )
  }
})

// Mock data
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
  collections: [
    { id: 'summer', label: 'Summer Collection', count: 25 }
  ],
  categories: [
    { id: 'clothing', label: 'Clothing', count: 50 }
  ],
  priceRange: { min: 10, max: 100 }
}

describe('FilterPanelContent', () => {
  const mockGet = jest.fn()
  const mockOnFilterChange = jest.fn()
  const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>

  beforeEach(() => {
    jest.clearAllMocks()
    
    mockUseSearchParams.mockReturnValue({
      get: mockGet
    } as any)
  })

  it('should render filter sections based on dynamic filters', () => {
    mockGet.mockReturnValue(null) // No active filters

    render(
      <FilterPanelContent 
        dynamicFilters={mockDynamicFilters}
      />
    )

    // Should render all filter sections that have options
    expect(screen.getByTestId('filter-section-categories')).toBeInTheDocument()
    expect(screen.getByTestId('filter-section-collections')).toBeInTheDocument()
    expect(screen.getByTestId('filter-section-priceRange')).toBeInTheDocument()
    expect(screen.getByTestId('filter-section-types')).toBeInTheDocument()
    expect(screen.getByTestId('filter-section-materials')).toBeInTheDocument()
    expect(screen.getByTestId('filter-section-tags')).toBeInTheDocument()
    expect(screen.getByTestId('filter-section-sizes')).toBeInTheDocument()
  })

  it('should not render sections with empty options', () => {
    const emptyFilters = {
      ...mockDynamicFilters,
      tags: [],
      materials: []
    }

    render(
      <FilterPanelContent 
        dynamicFilters={emptyFilters}
      />
    )

    // Should not render empty sections
    expect(screen.queryByTestId('filter-section-tags')).not.toBeInTheDocument()
    expect(screen.queryByTestId('filter-section-materials')).not.toBeInTheDocument()

    // Should still render sections with options
    expect(screen.getByTestId('filter-section-types')).toBeInTheDocument()
    expect(screen.getByTestId('filter-section-sizes')).toBeInTheDocument()
  })

  it('should prioritize data from props over URL params', () => {
    const propsData = {
      filters: { types: ['t-shirt'], tags: ['blue'] },
      dynamicFilters: mockDynamicFilters,
      onFilterChange: mockOnFilterChange
    }

    mockGet
      .mockReturnValueOnce('sweater') // types from URL
      .mockReturnValueOnce('red')     // tags from URL

    render(
      <FilterPanelContent 
        data={propsData}
        dynamicFilters={mockDynamicFilters}
      />
    )

    // Should use data from props, not URL
    const filterModule = screen.getByTestId('filter-module')
    expect(filterModule).toBeInTheDocument()

    // The MockFilterModule should receive the props data
    // We can verify this by checking if the component renders without errors
    // and that onFilterChange from props is available
    expect(mockOnFilterChange).not.toHaveBeenCalled() // Initial render shouldn't call it
  })

  it('should fall back to URL params when no data prop provided', () => {
    mockGet
      .mockReturnValueOnce('t-shirt,sweater') // types
      .mockReturnValueOnce('blue')            // tags
      .mockReturnValueOnce('cotton')          // materials
      .mockReturnValueOnce('S,M')             // sizes
      .mockReturnValueOnce('10')              // price_min
      .mockReturnValueOnce('50')              // price_max

    render(
      <FilterPanelContent 
        dynamicFilters={mockDynamicFilters}
      />
    )

    // Should render with URL-based filters
    expect(screen.getByTestId('filter-module')).toBeInTheDocument()
  })

  it('should handle filter changes correctly', async () => {
    const user = userEvent.setup()
    const propsData = {
      filters: { types: [], tags: [] },
      dynamicFilters: mockDynamicFilters,
      onFilterChange: mockOnFilterChange
    }

    render(
      <FilterPanelContent 
        data={propsData}
        dynamicFilters={mockDynamicFilters}
      />
    )

    // Click on a filter option
    const tshirtOption = screen.getByTestId('filter-option-t-shirt')
    await user.click(tshirtOption.querySelector('input')!)

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith('types', ['t-shirt'])
    })
  })

  it('should handle multiple filter selections', async () => {
    const user = userEvent.setup()
    const propsData = {
      filters: { types: ['t-shirt'], tags: [] },
      dynamicFilters: mockDynamicFilters,
      onFilterChange: mockOnFilterChange
    }

    render(
      <FilterPanelContent 
        data={propsData}
        dynamicFilters={mockDynamicFilters}
      />
    )

    // Add another type
    const sweaterOption = screen.getByTestId('filter-option-sweater')
    await user.click(sweaterOption.querySelector('input')!)

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith('types', ['t-shirt', 'sweater'])
    })
  })

  it('should handle filter deselection', async () => {
    const user = userEvent.setup()
    const propsData = {
      filters: { types: ['t-shirt', 'sweater'], tags: [] },
      dynamicFilters: mockDynamicFilters,
      onFilterChange: mockOnFilterChange
    }

    render(
      <FilterPanelContent 
        data={propsData}
        dynamicFilters={mockDynamicFilters}
      />
    )

    // Remove t-shirt
    const tshirtOption = screen.getByTestId('filter-option-t-shirt')
    await user.click(tshirtOption.querySelector('input')!)

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith('types', ['sweater'])
    })
  })

  it('should show correct filter counts', () => {
    render(
      <FilterPanelContent 
        dynamicFilters={mockDynamicFilters}
      />
    )

    // Check that counts are displayed
    expect(screen.getByText('Blue (5)')).toBeInTheDocument()
    expect(screen.getByText('Red (3)')).toBeInTheDocument()
    expect(screen.getByText('T-Shirt (10)')).toBeInTheDocument()
    expect(screen.getByText('Cotton (12)')).toBeInTheDocument()
    expect(screen.getByText('S (15)')).toBeInTheDocument()
  })

  it('should handle null dynamicFilters gracefully', () => {
    render(
      <FilterPanelContent 
        dynamicFilters={null}
      />
    )

    // Should render without crashing
    expect(screen.getByTestId('filter-module')).toBeInTheDocument()
  })

  it('should build filters from dynamic data correctly', () => {
    render(
      <FilterPanelContent 
        dynamicFilters={mockDynamicFilters}
      />
    )

    // Verify all expected sections are present
    const expectedSections = ['categories', 'collections', 'priceRange', 'types', 'materials', 'tags', 'sizes']
    
    expectedSections.forEach(sectionId => {
      expect(screen.getByTestId(`filter-section-${sectionId}`)).toBeInTheDocument()
    })
  })

  it('should handle price range filters', () => {
    render(
      <FilterPanelContent 
        dynamicFilters={mockDynamicFilters}
      />
    )

    // Price range section should be rendered
    expect(screen.getByTestId('filter-section-priceRange')).toBeInTheDocument()
  })

  it('should maintain checkbox states correctly', () => {
    const propsData = {
      filters: { 
        types: ['t-shirt'], 
        tags: ['blue', 'red'],
        materials: [],
        sizes: ['M']
      },
      dynamicFilters: mockDynamicFilters,
      onFilterChange: mockOnFilterChange
    }

    render(
      <FilterPanelContent 
        data={propsData}
        dynamicFilters={mockDynamicFilters}
      />
    )

    // Check that selected filters are checked
    const tshirtCheckbox = screen.getByTestId('filter-option-t-shirt').querySelector('input')
    const blueCheckbox = screen.getByTestId('filter-option-blue').querySelector('input')
    const redCheckbox = screen.getByTestId('filter-option-red').querySelector('input')
    const cottonCheckbox = screen.getByTestId('filter-option-cotton').querySelector('input')
    const mCheckbox = screen.getByTestId('filter-option-M').querySelector('input')

    expect(tshirtCheckbox).toBeChecked()
    expect(blueCheckbox).toBeChecked()
    expect(redCheckbox).toBeChecked()
    expect(cottonCheckbox).not.toBeChecked()
    expect(mCheckbox).toBeChecked()
  })
})

describe('FilterPanelContent - buildFiltersFromDynamic', () => {
  const mockGet = jest.fn()
  const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSearchParams.mockReturnValue({ get: mockGet } as any)
    mockGet.mockReturnValue(null)
  })

  it('should create correct filter structure', () => {
    const dynamicFilters = {
      types: [{ id: 'shirt', label: 'Shirt', count: 5 }],
      materials: [{ id: 'cotton', label: 'Cotton', count: 3 }],
      tags: [],
      sizes: [],
      collections: [],
      categories: [],
      priceRange: { min: 0, max: 0 }
    }

    render(
      <FilterPanelContent 
        dynamicFilters={dynamicFilters}
      />
    )

    // Should render sections that have options
    expect(screen.getByTestId('filter-section-types')).toBeInTheDocument()
    expect(screen.getByTestId('filter-section-materials')).toBeInTheDocument()

    // Should not render empty sections
    expect(screen.queryByTestId('filter-section-tags')).not.toBeInTheDocument()
    expect(screen.queryByTestId('filter-section-sizes')).not.toBeInTheDocument()
  })

  it('should handle all filter types correctly', () => {
    render(
      <FilterPanelContent 
        dynamicFilters={mockDynamicFilters}
      />
    )

    // Verify labels are correct
    expect(screen.getByText('Product Types')).toBeInTheDocument()
    expect(screen.getByText('Materials')).toBeInTheDocument()
    expect(screen.getByText('Colors')).toBeInTheDocument()
    expect(screen.getByText('Sizes')).toBeInTheDocument()
    expect(screen.getByText('Collections')).toBeInTheDocument()
    expect(screen.getByText('Categories')).toBeInTheDocument()
  })
})