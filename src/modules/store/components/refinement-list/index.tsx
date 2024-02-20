"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import SortProducts, { SortOptions } from "./sort-products"
import VehicleFilter from "./vehicle-filter"
import { VehicleDTO } from "types/global"

type RefinementListProps = {
  sortBy: SortOptions
  vehicles?: VehicleDTO[]
  search?: boolean
}

export type QueryParam = {
  name: string
  value: string
}

const RefinementList = ({ sortBy, vehicles }: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (param: QueryParam) => {
      const queryParams = new URLSearchParams(searchParams)

      queryParams.set(param.name, param.value)

      if (param.value === "") {
        queryParams.delete(param.name)
      }

      return queryParams.toString()
    },
    [searchParams]
  )

  const setQueryParams = (param: QueryParam) => {
    const query = createQueryString(param)
    router.push(`${pathname}?${query}`)
  }

  return (
    <div className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]">
      <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} />
      {vehicles && vehicles.length > 0 && (
        <VehicleFilter vehicles={vehicles} setQueryParams={setQueryParams} />
      )}
    </div>
  )
}

export default RefinementList
