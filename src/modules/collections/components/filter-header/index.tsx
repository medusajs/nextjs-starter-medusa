import React from "react"

type FilterHeaderProps = {
  count: number
  header: string
}

const FilterHeader: React.FC<FilterHeaderProps> = ({ count, header }) => {
  return (
    <div className="sticky top-16 bg-white z-30 h-12 flex items-center border-b border-gray-200 justify-between lg:px-8 text-gray-700 text-small-regular">
      <div className="gap-x-2 flex items-center">
        <span className="font-semibold">{header}</span>
        <div className="divide-x divide-gray-200 " />
        <span>
          {count} {count === 1 ? "product" : "products"}
        </span>
      </div>
    </div>
  )
}

export default FilterHeader
