"use client"

import React, { useState } from "react"
import * as Collapsible from "@radix-ui/react-collapsible"
import * as Checkbox from "@radix-ui/react-checkbox"
import * as Slider from "@radix-ui/react-slider"
import { ChevronDown, ChevronUp, Check } from "lucide-react"

interface FilterOption {
  id: string
  label: string
  count?: number
}

interface FilterSection {
  id: string
  title: string
  type: 'checkbox' | 'price-range' | 'color'
  options?: FilterOption[]
  min?: number
  max?: number
}

interface FilterModuleProps {
  filters: FilterSection[]
  onFilterChange: (filterId: string, value: any) => void
  activeFilters: Record<string, any>
}

const FilterModule: React.FC<FilterModuleProps> = ({
  filters,
  onFilterChange,
  activeFilters
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    filters.reduce((acc, filter) => ({ ...acc, [filter.id]: true }), {})
  )

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const handleCheckboxChange = (filterId: string, optionId: string, checked: boolean) => {
    const currentValues = activeFilters[filterId] || []
    const newValues = checked 
      ? [...currentValues, optionId]
      : currentValues.filter((id: string) => id !== optionId)
    

    
    onFilterChange(filterId, newValues)
  }

  const handlePriceRangeChange = (filterId: string, values: number[]) => {
    onFilterChange(filterId, { min: values[0], max: values[1] })
  }

  const renderCheckboxSection = (section: FilterSection) => (
    <div className="space-y-3">
      {section.options?.map((option) => {
        const currentFilterValues = activeFilters[section.id] || []
        const isChecked = currentFilterValues.includes(option.id)
        

        
        return (
          <div key={option.id} className="flex items-center space-x-3">
            <Checkbox.Root
              id={`${section.id}-${option.id}`}
              checked={isChecked}
              onCheckedChange={(checked) => 
                handleCheckboxChange(section.id, option.id, checked === true)
              }
              className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            >
              <Checkbox.Indicator>
                <Check className="h-3 w-3 text-white" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            
            <label 
              htmlFor={`${section.id}-${option.id}`}
              className="text-sm text-gray-700 cursor-pointer flex-1"
            >
              <span>{option.label}</span>
              {option.count && (
                <span className="text-gray-400 ml-1">({option.count})</span>
              )}
            </label>
          </div>
        )
      })}
    </div>
  )

  const renderPriceRangeSection = (section: FilterSection) => {
    const currentRange = activeFilters[section.id] || { min: section.min, max: section.max }
    
    return (
      <div className="space-y-4">
        <div className="px-3">
          <Slider.Root
            value={[currentRange.min, currentRange.max]}
            onValueChange={(values) => handlePriceRangeChange(section.id, values)}
            max={section.max}
            min={section.min}
            step={10}
            className="relative flex items-center select-none touch-none w-full h-5"
          >
            <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
              <Slider.Range className="absolute bg-blue-600 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-blue-600 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-blue-600 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </Slider.Root>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>${currentRange.min}</span>
          <span>${currentRange.max}</span>
        </div>
      </div>
    )
  }

  const renderColorSection = (section: FilterSection) => (
    <div className="grid grid-cols-6 gap-2">
      {section.options?.map((option) => {
        const isSelected = (activeFilters[section.id] || []).includes(option.id)
        
        return (
          <button
            key={option.id}
            onClick={() => handleCheckboxChange(section.id, option.id, !isSelected)}
            className={`
              w-8 h-8 rounded-full border-2 relative
              ${isSelected ? 'border-gray-800' : 'border-gray-300'}
              hover:border-gray-400
            `}
            style={{ backgroundColor: option.id }}
            title={option.label}
          >
            {isSelected && (
              <Check className="h-4 w-4 text-white absolute inset-0 m-auto drop-shadow-sm" />
            )}
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold text-gray-900">
        Filters
      </div>
      
      {filters.map((section) => (
        <Collapsible.Root
          key={section.id}
          open={openSections[section.id]}
          onOpenChange={() => toggleSection(section.id)}
        >
          <Collapsible.Trigger className="flex items-center justify-between w-full py-2 text-left">
            <h3 className="text-sm font-medium text-gray-900">{section.title}</h3>
            {openSections[section.id] ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </Collapsible.Trigger>
          
          <Collapsible.Content className="pb-4">
            {section.type === 'checkbox' && renderCheckboxSection(section)}
            {section.type === 'price-range' && renderPriceRangeSection(section)}
            {section.type === 'color' && renderColorSection(section)}
          </Collapsible.Content>
        </Collapsible.Root>
      ))}
      
      {/* Clear Filters Button */}
      {Object.keys(activeFilters).length > 0 && (
        <button
          onClick={() => {
            Object.keys(activeFilters).forEach(filterId => {
              const filterSection = filters.find(f => f.id === filterId)
              onFilterChange(filterId, filterSection?.type === 'checkbox' ? [] : null)
            })
          }}
          className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 rounded-md transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  )
}

export default FilterModule