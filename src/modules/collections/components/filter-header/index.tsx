type FilterHeaderProps = {
  count: number
  header: string
}

const FilterHeader = ({ count, header }: FilterHeaderProps) => {
  return (
    <div className="sticky top-0 bg-white z-30 h-12 flex items-center border-b border-gray-200 justify-between px-8 text-gray-700 text-small-regular">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-large-semi">{header}</h1>
        <span>
          {count} {count === 1 ? "product" : "products"}
        </span>
      </div>
    </div>
  )
}

export default FilterHeader
