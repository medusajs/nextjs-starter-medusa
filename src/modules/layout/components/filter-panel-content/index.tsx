"use client"

import React from "react"
import { Filter, ArrowLeft, X } from "lucide-react"
import { useCompanionPanel } from "@lib/context/companion-panel-context"
import { useSearchParams } from "next/navigation"
import FilterModule from "@modules/store/components/filter-module"

interface FilterPanelContentProps {
  data?: {
    filters?: any[]
    activeFilters?: Record<string, any>
    onFilterChange?: (filterId: string, value: any) => void
    dynamicFilters?: {
      tags: Array<{ id: string; label: string; count: number }>
      types: Array<{ id: string; label: string; count: number }>
      materials: Array<{ id: string; label: string; count: number }>
      sizes: Array<{ id: string; label: string; count: number }>
      collections: Array<{ id: string; label: string; count: number }>
      categories: Array<{ id: string; label: string; count: number }>
      priceRange: { min: number; max: number }
    }
  }
  dynamicFilters?: {
    tags: Array<{ id: string; label: string; count: number }>
    types: Array<{ id: string; label: string; count: number }>
    materials: Array<{ id: string; label: string; count: number }>
    sizes: Array<{ id: string; label: string; count: number }>
    collections: Array<{ id: string; label: string; count: number }>
    categories: Array<{ id: string; label: string; count: number }>
    priceRange: { min: number; max: number }
  }
}

const FilterPanelContent: React.FC<FilterPanelContentProps> = ({ data, dynamicFilters }) => {
  const { goBack, panelHistory, closePanel } = useCompanionPanel()
  const searchParams = useSearchParams()
  
  // Get fresh activeFilters from URL instead of stale panel data
  const getActiveFiltersFromURL = () => {
    return {
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
      types: searchParams.get('types')?.split(',').filter(Boolean) || [],
      materials: searchParams.get('materials')?.split(',').filter(Boolean) || [],
      sizes: searchParams.get('sizes')?.split(',').filter(Boolean) || [],
      priceRange: (searchParams.get('price_min') || searchParams.get('price_max')) ? {
        min: searchParams.get('price_min') ? parseInt(searchParams.get('price_min')!) : undefined,
        max: searchParams.get('price_max') ? parseInt(searchParams.get('price_max')!) : undefined,
      } : undefined,
    }
  }
  
  // Build filters from dynamic data or use defaults
  const buildFilters = () => {
    const filters = []

    // Categories filter
    if (dynamicFilters?.categories && dynamicFilters.categories.length > 0) {
      filters.push({
        id: 'categories',
        title: 'Categories',
        type: 'checkbox' as const,
        options: dynamicFilters.categories
      })
    }

    // Collections filter
    if (dynamicFilters?.collections && dynamicFilters.collections.length > 0) {
      filters.push({
        id: 'collections',
        title: 'Collections',
        type: 'checkbox' as const,
        options: dynamicFilters.collections
      })
    }

    // Price range filter
    if (dynamicFilters?.priceRange && dynamicFilters.priceRange.max > 0) {
      filters.push({
        id: 'price',
        title: 'Price Range',
        type: 'price-range' as const,
        min: dynamicFilters.priceRange.min,
        max: dynamicFilters.priceRange.max
      })
    }

    // Product type filter
    if (dynamicFilters?.types && dynamicFilters.types.length > 0) {
      filters.push({
        id: 'types',
        title: 'Product Types',
        type: 'checkbox' as const,
        options: dynamicFilters.types
      })
    }

    // Materials filter
    if (dynamicFilters?.materials && dynamicFilters.materials.length > 0) {
      filters.push({
        id: 'materials',
        title: 'Materials',
        type: 'checkbox' as const,
        options: dynamicFilters.materials
      })
    }

    // Tags filter (Colors)
    if (dynamicFilters?.tags && dynamicFilters.tags.length > 0) {
      filters.push({
        id: 'tags',
        title: 'Colors',
        type: 'checkbox' as const,
        options: dynamicFilters.tags
      })
    }

    // Sizes filter
    if (dynamicFilters?.sizes && dynamicFilters.sizes.length > 0) {
      filters.push({
        id: 'sizes',
        title: 'Sizes',
        type: 'checkbox' as const,
        options: dynamicFilters.sizes
      })
    }

    // Default fallback filters if no dynamic data
    if (filters.length === 0) {
      return [
        {
          id: 'categories',
          title: 'Categories',
          type: 'checkbox' as const,
          options: [
            { id: 'clothing', label: 'Clothing', count: 0 },
            { id: 'shoes', label: 'Shoes', count: 0 },
            { id: 'accessories', label: 'Accessories', count: 0 },
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

    return filters
  }

  const dynamicFilterConfig = buildFilters()

  // Use data from FilterSortBar if available (includes dynamicFilters), otherwise use props and fallbacks
  const dataDynamicFilters = data?.dynamicFilters || dynamicFilters
  const filters = data?.filters || (dataDynamicFilters ? buildFiltersFromDynamic(dataDynamicFilters) : dynamicFilterConfig)
  
  // CRITICAL FIX: Get activeFilters from URL instead of stale panel data
  const activeFilters = getActiveFiltersFromURL()
  const onFilterChange = data?.onFilterChange || (() => {})
  

  
  // Build filters from dynamic data (used when FilterSortBar passes dynamicFilters)
  function buildFiltersFromDynamic(dynamicFilters: any) {
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

    return sections
  }

  // Count active filters for display
  const activeFilterCount = Object.values(activeFilters).reduce((count, filterValue) => {
    if (Array.isArray(filterValue)) {
      return count + filterValue.length
    }
    if (filterValue && typeof filterValue === 'object' && filterValue.min !== undefined) {
      return count + 1
    }
    return count
  }, 0)

  // Handle back button click
  const handleBackClick = () => {
    if (panelHistory.length > 0) {
      goBack()
    } else {
      closePanel()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with Back and Close Buttons */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        {/* Left side - Back button */}
        <button
          onClick={handleBackClick}
          className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
          title={panelHistory.length > 0 ? 'Go back' : 'Close filters'}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {/* Center - Title */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-6 h-6 text-sm font-bold text-white bg-blue-600 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        
        {/* Right side - Close button */}
        <button
          onClick={closePanel}
          className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
          title="Close filters"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        <FilterModule
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
        />
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-3">
        {/* Active filters summary */}
        {activeFilterCount > 0 && (
          <div className="text-sm text-gray-600 text-center">
            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
          </div>
        )}
        
        {/* Clear All Button */}
        {activeFilterCount > 0 && (
          <button
            onClick={() => {
              Object.keys(activeFilters).forEach(filterId => {
                const filterSection = filters.find(f => f.id === filterId)
                onFilterChange(filterId, filterSection?.type === 'checkbox' ? [] : null)
              })
            }}
            className="w-full py-2 px-4 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-md transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  )
}

export default FilterPanelContent