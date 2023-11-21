import { StoreGetProductsParams } from "@medusajs/medusa"
import SortProducts, { SortOptions } from "./sort-products"
import CollectionFilter from "./collection-filter"

type RefinementListProps = {
  refinementList: StoreGetProductsParams
  setRefinementList: (refinementList: StoreGetProductsParams) => void
  sortBy: SortOptions
  setSortBy: (...args: any[]) => void
  search?: boolean
}

const RefinementList = ({
  refinementList,
  setRefinementList,
  sortBy,
  setSortBy,
  search = false,
}: RefinementListProps) => {
  return (
    <div className="flex small:flex-col gap-12 px-8 py-4 mb-8 small:pr-0 small:pl-8 small:min-w-[250px] small:ml-[1.675rem]">
      <SortProducts sortBy={sortBy} setSortBy={setSortBy} />
      {!search && (
        <CollectionFilter
          refinementList={refinementList}
          setRefinementList={setRefinementList}
        />
      )}
    </div>
  )
}

export default RefinementList
