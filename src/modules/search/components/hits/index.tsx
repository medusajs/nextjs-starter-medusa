import { ProductHit } from "@modules/search/components/hit"
import React from "react"
import {
  useHits,
  UseHitsProps,
  useSearchBox,
} from "react-instantsearch-hooks-web"

type HitsProps<THit> = React.ComponentProps<"div"> &
  UseHitsProps & {
    hitComponent: (props: { hit: THit }) => JSX.Element
  }

const Hits = ({ hitComponent: Hit, ...props }: HitsProps<ProductHit>) => {
  const { hits } = useHits(props)
  const { query } = useSearchBox()

  // If the query is empty, we don't want to show the initial hits
  if (!!query === false || !hits.length) {
    return null
  }

  return (
    <div className="overflow-y-auto">
      <div>
        <h1>Products</h1>
      </div>
      <div className="grid grid-cols-5 gap-4 py-4">
        {hits.map((hit) => (
          <li key={hit.objectID} className="list-none">
            <Hit hit={hit as unknown as ProductHit} />
          </li>
        ))}
      </div>
    </div>
  )
}

export default Hits
