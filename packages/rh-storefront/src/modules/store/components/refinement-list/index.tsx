"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import SortProducts, { SortOptions } from "./sort-products"
import { PlpViewMode } from "@modules/store/lib/plp-view-config"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  "data-testid"?: string
  /** `toolbar`: RH-style compact sort (default). `sidebar`: legacy vertical radio list. */
  layout?: "toolbar" | "sidebar"
  viewMode?: PlpViewMode
  allowedViews?: PlpViewMode[]
}

const RefinementList = ({
  sortBy,
  "data-testid": dataTestId,
  layout = "toolbar",
  viewMode,
  allowedViews = [],
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

  const setViewQueryParam = (value: PlpViewMode) => {
    const params = new URLSearchParams(searchParams)
    params.set("view", String(value))
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
  }

  const renderViewGlyph = (option: PlpViewMode, isActive: boolean) => {
    const cellClass = isActive ? "bg-qw-black" : "bg-qw-light-grey"

    if (option === 1) {
      return <span className={`h-3.5 w-4 ${cellClass}`} />
    }

    if (option === 2) {
      return (
        <span className="grid grid-cols-2 grid-rows-2 gap-[2px]">
          <span className={`h-[6px] w-[6px] ${cellClass}`} />
          <span className={`h-[6px] w-[6px] ${cellClass}`} />
          <span className={`h-[6px] w-[6px] ${cellClass}`} />
          <span className={`h-[6px] w-[6px] ${cellClass}`} />
        </span>
      )
    }

    return (
      <span className="grid grid-cols-3 grid-rows-3 gap-[2px]">
        <span className={`h-[4px] w-[4px] ${cellClass}`} />
        <span className={`h-[4px] w-[4px] ${cellClass}`} />
        <span className={`h-[4px] w-[4px] ${cellClass}`} />
        <span className={`h-[4px] w-[4px] ${cellClass}`} />
        <span className={`h-[4px] w-[4px] ${cellClass}`} />
        <span className={`h-[4px] w-[4px] ${cellClass}`} />
        <span className={`h-[4px] w-[4px] ${cellClass}`} />
        <span className={`h-[4px] w-[4px] ${cellClass}`} />
        <span className={`h-[4px] w-[4px] ${cellClass}`} />
      </span>
    )
  }

  const orderedViews = [...allowedViews].sort((a, b) => b - a)

  return (
    <div
      className={
        layout === "toolbar"
          ? "shrink-0 inline-flex items-center justify-end gap-3"
          : "flex flex-col gap-y-8 py-8 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]"
      }
    >
      <SortProducts
        sortBy={sortBy}
        setQueryParams={setQueryParams}
        data-testid={dataTestId}
        presentation={layout === "toolbar" ? "select" : "list"}
      />
      {layout === "toolbar" && allowedViews.length > 0 ? (
        <div
          className="inline-flex items-center gap-1.5"
          data-testid="plp-view-switcher"
          aria-label="Product grid view"
        >
          {orderedViews.map((option) => {
            const isActive = viewMode === option

            return (
              <button
                key={option}
                type="button"
                onClick={() => setViewQueryParam(option)}
                aria-pressed={isActive}
                className="h-6 w-6 p-0 inline-flex items-center justify-center bg-transparent border-0"
                title={`${option} products per row`}
              >
                {renderViewGlyph(option, isActive)}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default RefinementList
