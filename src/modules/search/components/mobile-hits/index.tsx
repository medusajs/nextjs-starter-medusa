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

const MobileHits = ({
  hitComponent: Hit,
  className,
  ...props
}: HitsProps<ProductHit>) => {
  const { hits } = useHits(props)
  const { query } = useSearchBox()

  // If the query is empty, we don't want to show the initial hits
  if (!!query === false || !hits.length) {
    return null
  }

  return (
    <div className={className}>
      <span className="text-small-regular uppercase text-gray-700">
        Results
      </span>
      <div className="grid grid-cols-1 py-4">
        {hits.map((hit, index) => (
          <li key={index} className="list-none">
            <Hit hit={hit as unknown as ProductHit} />
          </li>
        ))}
      </div>
    </div>
  )
}

export default MobileHits
