import { StoreGetProductsParams } from "@medusajs/medusa"
import SortProducts, { SortOptions } from "./sort-products"
import CollectionFilter from "./collection-filter"

type RefinementListProps = {
  refinementList: StoreGetProductsParams
  setRefinementList: (refinementList: StoreGetProductsParams) => void
  sortBy: SortOptions
  setSortBy: (...args: any[]) => void
}

const RefinementList = ({
  refinementList,
  setRefinementList,
  sortBy,
  setSortBy,
}: RefinementListProps) => (
  <div className="flex small:flex-col gap-12 px-8 py-4 mb-8 small:pr-0 small:pl-8 small:min-w-[250px] small:ml-[1.675rem]">
    <SortProducts sortBy={sortBy} setSortBy={setSortBy} />
    <CollectionFilter
      refinementList={refinementList}
      setRefinementList={setRefinementList}
    />
  </div>
)

export default RefinementList
