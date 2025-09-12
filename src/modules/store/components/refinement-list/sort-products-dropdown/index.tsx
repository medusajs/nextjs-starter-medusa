"use client"

import React from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { ChevronDown, Check } from "lucide-react"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsDropdownProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "created_at" as SortOptions,
    label: "Latest Arrivals",
  },
  {
    value: "price_asc" as SortOptions,
    label: "Price: Low → High",
  },
  {
    value: "price_desc" as SortOptions,
    label: "Price: High → Low",
  },
]

const SortProductsDropdown = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsDropdownProps) => {
  const currentOption = sortOptions.find(option => option.value === sortBy)
  
  const handleSelect = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  return (
    <div className="relative">
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger asChild>
          <button
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            data-testid={dataTestId}
          >
            <span>{currentOption?.label || "Select sort order"}</span>
            <ChevronDown className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[12rem] bg-white rounded-md border border-gray-200 py-1 z-50"
            sideOffset={4}
            align="start"
          >
            {sortOptions.map((option) => (
              <DropdownMenu.Item
                key={option.value}
                className="flex items-center justify-between px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none cursor-pointer"
                onSelect={() => handleSelect(option.value)}
              >
                <span>{option.label}</span>
                {sortBy === option.value && (
                  <Check className="w-3.5 h-3.5 text-blue-600" />
                )}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  )
}

export default SortProductsDropdown