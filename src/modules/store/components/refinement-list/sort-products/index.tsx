"use client"

import { useTranslations } from "next-intl"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "created_at",
    label: 'LATEST_ARRIVALS'
  },
  {
    value: "price_asc",
    label: 'PRICE_LOW_HIGH',
  },
  {
    value: "price_desc",
    label: 'PRICE_HIGH_LOW',
  },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  const t = useTranslations()

  return (
    <FilterRadioGroup
      title={t('SORT_BY')}
      items={sortOptions}
      value={sortBy}
      handleChange={handleChange}
      data-testid={dataTestId}
    />
  )
}

export default SortProducts
