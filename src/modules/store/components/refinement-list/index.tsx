"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"

import SortProductsDropdown, { SortOptions } from "./sort-products-dropdown"
import FilterModule from "../filter-module"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  'data-testid'?: string
}

const RefinementList = ({ sortBy, 'data-testid': dataTestId }: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Filter state
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})

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
    setActiveFilters(prev => ({
      ...prev,
      [filterId]: value
    }))
    
    // TODO: Update URL with filter parameters
    // For now, just store in state - will need to implement URL param handling
  }

  // Sample filter configuration - in real app, this would come from props/API
  const filterSections = [
    {
      id: 'categories',
      title: 'Categories',
      type: 'checkbox' as const,
      options: [
        { id: 'clothing', label: 'Clothing', count: 142 },
        { id: 'shoes', label: 'Shoes', count: 98 },
        { id: 'accessories', label: 'Accessories', count: 67 },
        { id: 'bags', label: 'Bags', count: 34 },
      ]
    },
    {
      id: 'price',
      title: 'Price Range',
      type: 'price-range' as const,
      min: 0,
      max: 500
    },
    {
      id: 'colors',
      title: 'Colors',
      type: 'color' as const,
      options: [
        { id: '#000000', label: 'Black' },
        { id: '#FFFFFF', label: 'White' },
        { id: '#FF0000', label: 'Red' },
        { id: '#0000FF', label: 'Blue' },
        { id: '#008000', label: 'Green' },
        { id: '#FFC0CB', label: 'Pink' },
      ]
    },
    {
      id: 'brands',
      title: 'Brands',
      type: 'checkbox' as const,
      options: [
        { id: 'nike', label: 'Nike', count: 45 },
        { id: 'adidas', label: 'Adidas', count: 38 },
        { id: 'puma', label: 'Puma', count: 23 },
        { id: 'converse', label: 'Converse', count: 19 },
      ]
    }
  ]

  return (
    <div className="flex small:flex-col gap-8 py-4 mb-8 small:px-0 pl-6 small:min-w-[280px] small:ml-[1.675rem]">
      <SortProductsDropdown sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />
      
      <div className="border-t border-gray-200 pt-6">
        <FilterModule
          filters={filterSections}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
        />
      </div>
    </div>
  )
}

export default RefinementList
