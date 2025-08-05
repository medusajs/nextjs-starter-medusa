"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import FilterSortBar from "@modules/store/components/filter-sort-bar"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types"
import PaginatedProducts from "@modules/store/templates/paginated-products"

interface FilteredProductsClientProps {
  sortBy?: SortOptions
  page: number
  countryCode: string
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  title?: string
  dynamicFilters: {
    tags: Array<{ id: string; label: string; count: number }>
    types: Array<{ id: string; label: string; count: number }>
    materials: Array<{ id: string; label: string; count: number }>
    sizes: Array<{ id: string; label: string; count: number }>
    collections: Array<{ id: string; label: string; count: number }>
    categories: Array<{ id: string; label: string; count: number }>
    priceRange: { min: number; max: number }
  } | null
  // Pre-fetched data from server
  products: HttpTypes.StoreProduct[]
  count: number
  region: HttpTypes.StoreRegion
}

export default function FilteredProductsClient({
  sortBy,
  page,
  countryCode,
  collectionId,
  categoryId,
  productsIds,
  title,
  dynamicFilters,
  products,
  count,
  region
}: FilteredProductsClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Parse current filters from URL
  const getCurrentFilters = useCallback(() => {
    return {
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
      types: searchParams.get('types')?.split(',').filter(Boolean) || [],
      materials: searchParams.get('materials')?.split(',').filter(Boolean) || [],
      sizes: searchParams.get('sizes')?.split(',').filter(Boolean) || [],
      priceRange: searchParams.get('price_min') || searchParams.get('price_max') ? {
        min: searchParams.get('price_min') ? parseInt(searchParams.get('price_min')!) : undefined,
        max: searchParams.get('price_max') ? parseInt(searchParams.get('price_max')!) : undefined,
      } : undefined,
    }
  }, [searchParams])

  // ULTIMATE FIX: Read filters directly from actual browser URL (bypasses React state)
  const getCurrentFiltersFromActualURL = () => {
    if (typeof window === 'undefined') return { tags: [], types: [], materials: [], sizes: [] }
    
    const params = new URLSearchParams(window.location.search)
    
    return {
      tags: params.get('tags')?.split(',').filter(Boolean) || [],
      types: params.get('types')?.split(',').filter(Boolean) || [],
      materials: params.get('materials')?.split(',').filter(Boolean) || [],
      sizes: params.get('sizes')?.split(',').filter(Boolean) || [],
      priceRange: params.get('price_min') || params.get('price_max') ? {
        min: params.get('price_min') ? parseInt(params.get('price_min')!) : undefined,
        max: params.get('price_max') ? parseInt(params.get('price_max')!) : undefined,
      } : undefined,
    }
  }

  const [activeFilters, setActiveFilters] = useState(getCurrentFilters)

  // Sync activeFilters with URL params when they change
  useEffect(() => {
    const newFilters = getCurrentFilters()
    setActiveFilters(newFilters)
  }, [getCurrentFilters])

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams)
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
      
      return params.toString()
    },
    [searchParams]
  )

  const handleFilterChange = (filterId: string, value: any) => {
    // Read filters directly from current browser URL (not React state)
    const currentFiltersFromBrowserURL = getCurrentFiltersFromActualURL()
    const newFilters = { ...currentFiltersFromBrowserURL, [filterId]: value }
    setActiveFilters(newFilters)

    // CRITICAL FIX: Update URL with ALL active filters, not just the changed one
    const updates: Record<string, string | null> = {}
    
    // Tags (colors)
    updates.tags = Array.isArray(newFilters.tags) && newFilters.tags.length > 0 ? newFilters.tags.join(',') : null
    
    // Types 
    updates.types = Array.isArray(newFilters.types) && newFilters.types.length > 0 ? newFilters.types.join(',') : null
    
    // Materials
    updates.materials = Array.isArray(newFilters.materials) && newFilters.materials.length > 0 ? newFilters.materials.join(',') : null
    
    // Sizes
    updates.sizes = Array.isArray(newFilters.sizes) && newFilters.sizes.length > 0 ? newFilters.sizes.join(',') : null
    
    // Price range
    if (newFilters.priceRange) {
      updates.price_min = newFilters.priceRange.min ? newFilters.priceRange.min.toString() : null
      updates.price_max = newFilters.priceRange.max ? newFilters.priceRange.max.toString() : null
    } else {
      updates.price_min = null
      updates.price_max = null
    }

    // Reset to page 1 when filters change
    updates.page = '1'

    const query = createQueryString(updates)

    router.push(`${pathname}?${query}`)
  }

  // Render filter controls and product grid

  return (
    <>
      {/* Filter and Sort Bar - Sticky under header */}
      <FilterSortBar 
        sortBy={sortBy || "created_at"} 
        dynamicFilters={dynamicFilters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      />
      
      {/* Main Content */}
      <div className="content-container py-6" data-testid="category-container">
        {title && (
          <div className="mb-8 text-2xl-semi">
            <h1 data-testid="store-page-title">{title}</h1>
          </div>
        )}
        
        <PaginatedProducts
          products={products}
          count={count}
          page={page}
          region={region}
        />
      </div>
    </>
  )
}