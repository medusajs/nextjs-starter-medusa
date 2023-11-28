import { StoreGetProductsParams } from "@medusajs/medusa"
import { useCollections } from "medusa-react"
import { ChangeEvent } from "react"

type RefinementListProps = {
  refinementList: StoreGetProductsParams
  setRefinementList: (refinementList: StoreGetProductsParams) => void
}

const FilterCollections = ({
  refinementList,
  setRefinementList,
}: RefinementListProps) => {
  const { collections, isLoading } = useCollections()

  const handleCollectionChange = (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const { checked } = e.target

    const collectionIds = refinementList.collection_id || []

    const exists = collectionIds.includes(id)

    if (checked && !exists) {
      setRefinementList({
        ...refinementList,
        collection_id: [...collectionIds, id],
      })

      return
    }

    if (!checked && exists) {
      setRefinementList({
        ...refinementList,
        collection_id: collectionIds.filter((c) => c !== id),
      })

      return
    }

    return
  }

  return (
    <div className="flex gap-x-3 small:flex-col small:gap-y-3">
      <span className="text-base-semi">Collections</span>
      <ul className="text-base-regular flex items-center gap-x-4 small:grid small:grid-cols-1 small:gap-y-2">
        {collections?.map((c) => (
          <li key={c.id}>
            <label className="flex items-center gap-x-2">
              <input
                type="checkbox"
                defaultChecked={refinementList.collection_id?.includes(c.id)}
                onChange={(e) => handleCollectionChange(e, c.id)}
                className="accent-amber-200"
              />
              {c.title}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FilterCollections
