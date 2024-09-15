"use client"

import { ChangeEvent } from "react"
import { useI18n, useScopedI18n } from '../../../../../locales/client'

import FilterRadioGroup from "@modules/common/components/filter-radio-group"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  'data-testid'?: string
}

const SortProducts = ({ 'data-testid': dataTestId, sortBy, setQueryParams }: SortProductsProps) => {
  const handleChange = (e: ChangeEvent<HTMLButtonElement>) => {
    const newSortBy = e.target.value as SortOptions
    setQueryParams("sortBy", newSortBy)
  }

  const t = useScopedI18n('store')
  const sortOptions = [
    {
      value: "created_at",
      label: t("created_at"),
    },
    {
      value: "price_asc",
      label: t("price_asc"),
    },
    {
      value: "price_desc",
      label: t("price_desc"),
    },
  ]
  
  return (
    <FilterRadioGroup
      title={t("sort")}
      items={sortOptions}
      value={sortBy}
      handleChange={handleChange}
      data-testid={dataTestId}
    />
  )
}

export default SortProducts
