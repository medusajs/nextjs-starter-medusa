"use client"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"
import NativeSelect from "@modules/common/components/native-select"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

export const sortOptions = [
  {
    value: "created_at",
    label: "Latest arrivals",
  },
  {
    value: "price_asc",
    label: "Price, low to high",
  },
  {
    value: "price_desc",
    label: "Price, high to low",
  },
] as const

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
  presentation?: "list" | "select"
}

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
  presentation = "select",
}: SortProductsProps) => {
  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  if (presentation === "list") {
    return (
      <FilterRadioGroup
        title="Sort by"
        items={[...sortOptions]}
        value={sortBy}
        handleChange={handleChange}
        data-testid={dataTestId}
      />
    )
  }

  return (
    <div
      className="flex items-center gap-3 w-auto"
      data-testid={dataTestId}
    >
      <span className="text-caption uppercase tracking-[0.14em] text-qw-medium-grey shrink-0">
        Sort by
      </span>
      <NativeSelect
        aria-label="Sort products"
        value={sortBy}
        onChange={(e) => handleChange(e.target.value as SortOptions)}
        className="w-auto border-0 border-b border-qw-pale-grey rounded-none bg-qw-white shadow-none hover:bg-qw-warm-white [&_select]:py-2 [&_select]:pl-0 [&_select]:pr-8 [&_select]:text-caption [&_select]:text-qw-charcoal [&_select]:uppercase [&_select]:tracking-[0.08em]"
      >
        {sortOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </NativeSelect>
    </div>
  )
}

export default SortProducts
