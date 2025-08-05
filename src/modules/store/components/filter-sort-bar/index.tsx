"use client"

import React, { useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { Filter } from "lucide-react"

import SortProductsDropdown, { SortOptions } from "../refinement-list/sort-products-dropdown"
import { useCompanionPanel } from "@lib/context/companion-panel-context"

interface FilterSortBarProps {
  sortBy: SortOptions
  'data-testid'?: string
  dynamicFilters?: {
    tags: Array<{ id: string; label: string; count: number }>
    types: Array<{ id: string; label: string; count: number }>
    materials: Array<{ id: string; label: string; count: number }>
    sizes: Array<{ id: string; label: string; count: number }>
    collections: Array<{ id: string; label: string; count: number }>
    categories: Array<{ id: string; label: string; count: number }>
    priceRange: { min: number; max: number }
  }
  activeFilters?: Record<string, any>
  onFilterChange?: (filterId: string, value: any) => void
}

const FilterSortBar: React.FC<FilterSortBarProps> = ({ 
  sortBy, 
  'data-testid': dataTestId,
  dynamicFilters,
  activeFilters: externalActiveFilters,
  onFilterChange: externalOnFilterChange
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { openPanel, closePanel, goBack, currentPanel, panelHistory } = useCompanionPanel()
  
  // Use external filter state if provided, otherwise use internal state
  const [internalActiveFilters, setInternalActiveFilters] = useState<Record<string, any>>({})
  
  // Sync internal filters with external filters when they change
  useEffect(() => {
    if (externalActiveFilters) {
      setInternalActiveFilters(externalActiveFilters)
    }
  }, [externalActiveFilters])
  
  const activeFilters = externalActiveFilters || internalActiveFilters
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  const handleFilterChange = (filterId: string, value: any) => {
    if (externalOnFilterChange) {
      externalOnFilterChange(filterId, value)
    } else {
      setInternalActiveFilters(prev => ({
        ...prev,
        [filterId]: value
      }))
    }
  }

  // Build filter sections from dynamic data or use defaults
  const buildFilterSections = () => {
    const sections = []

    // Categories filter
    if (dynamicFilters?.categories && dynamicFilters.categories.length > 0) {
      sections.push({
        id: 'categories',
        title: 'Categories',
        type: 'checkbox' as const,
        options: dynamicFilters.categories
      })
    }

    // Collections filter
    if (dynamicFilters?.collections && dynamicFilters.collections.length > 0) {
      sections.push({
        id: 'collections',
        title: 'Collections',
        type: 'checkbox' as const,
        options: dynamicFilters.collections
      })
    }

    // Price range filter
    if (dynamicFilters?.priceRange && dynamicFilters.priceRange.max > 0) {
      sections.push({
        id: 'price',
        title: 'Price Range',
        type: 'price-range' as const,
        min: dynamicFilters.priceRange.min,
        max: dynamicFilters.priceRange.max
      })
    }

    // Product type filter
    if (dynamicFilters?.types && dynamicFilters.types.length > 0) {
      sections.push({
        id: 'types',
        title: 'Product Types',
        type: 'checkbox' as const,
        options: dynamicFilters.types
      })
    }

    // Materials filter
    if (dynamicFilters?.materials && dynamicFilters.materials.length > 0) {
      sections.push({
        id: 'materials',
        title: 'Materials',
        type: 'checkbox' as const,
        options: dynamicFilters.materials
      })
    }

    // Tags filter (Colors)
    if (dynamicFilters?.tags && dynamicFilters.tags.length > 0) {
      sections.push({
        id: 'tags',
        title: 'Colors',
        type: 'checkbox' as const,
        options: dynamicFilters.tags
      })
    }

    // Sizes filter
    if (dynamicFilters?.sizes && dynamicFilters.sizes.length > 0) {
      sections.push({
        id: 'sizes',
        title: 'Sizes',
        type: 'checkbox' as const,
        options: dynamicFilters.sizes
      })
    }

    // Default fallback if no dynamic data
    if (sections.length === 0) {
      return [
        {
          id: 'categories',
          title: 'Categories',
          type: 'checkbox' as const,
          options: [
            { id: 'clothing', label: 'Clothing', count: 0 },
            { id: 'shoes', label: 'Shoes', count: 0 },
          ]
        },
        {
          id: 'price',
          title: 'Price Range',
          type: 'price-range' as const,
          min: 0,
          max: 500
        }
      ]
    }

    return sections
  }

  const filterSections = buildFilterSections()

  // Count active filters for badge
  const activeFilterCount = Object.values(activeFilters).reduce((count, filterValue) => {
    if (Array.isArray(filterValue)) {
      return count + filterValue.length
    }
    if (filterValue && typeof filterValue === 'object' && filterValue.min !== undefined) {
      return count + 1
    }
    return count
  }, 0)

  const handleFilterClick = () => {
    // History-aware behavior: respect the panel history stack
    if (currentPanel?.type === 'filter') {
      // Filter is currently open - go back if there's history, otherwise close
      if (panelHistory.length > 0) {
        goBack() // Go back to previous panel (e.g., AI companion)
      } else {
        closePanel() // No history, close entirely
      }
    } else {
      // Filter is not current - open filter panel
      openPanel('filter', {
        filters: filterSections,
        activeFilters,
        onFilterChange: handleFilterChange,
        dynamicFilters // Pass dynamicFilters along with other data
      }, 'Filters')
    }
  }

  return (
    <div className="border-b border-gray-200 bg-white sticky top-16 z-40">
      <div className="content-container">
        <div className="flex items-center justify-between py-4 gap-4">
          {/* Left side - Filter button */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handleFilterClick}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                currentPanel?.type === 'filter'
                  ? 'text-blue-700 bg-blue-50 border-blue-300 hover:bg-blue-100'
                  : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
          
          {/* Right side - Sort dropdown */}
          <div className="flex items-center gap-4">
            <SortProductsDropdown 
              sortBy={sortBy} 
              setQueryParams={setQueryParams} 
              data-testid={dataTestId} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterSortBar