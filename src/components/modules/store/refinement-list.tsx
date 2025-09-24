"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/primitives/radio-group"
import { Label } from "@/components/ui/primitives/label"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  className?: string
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "created_at",
    label: "Latest Arrivals",
  },
  {
    value: "price_asc",
    label: "Price: Low -> High",
  },
  {
    value: "price_desc",
    label: "Price: High -> Low",
  },
]

const RefinementList = ({
  sortBy,
  className,
  "data-testid": dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

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

  return (
    <RadioGroup
      onValueChange={(v) => setQueryParams("sortBy", v)}
      defaultValue={sortBy}
      data-testid={dataTestId}
      className={className}
    >
      {sortOptions.map((i) => (
        <div key={i.value} className="flex items-center gap-2">
          <RadioGroupItem value={i.value} id={i.value} />
          <Label className="cursor-pointer" htmlFor={i.value}>
            {i.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}

export { RefinementList }
