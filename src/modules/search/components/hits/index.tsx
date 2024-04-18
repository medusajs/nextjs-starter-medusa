import { clx } from "@medusajs/ui"
import React from "react"
import {
  UseHitsProps,
  useHits,
  useSearchBox,
} from "react-instantsearch-hooks-web"

import { ProductHit } from "../hit"
import ShowAll from "../show-all"

type HitsProps<THit> = React.ComponentProps<"div"> &
  UseHitsProps & {
    hitComponent: (props: { hit: THit }) => JSX.Element
  }

const Hits = ({
  hitComponent: Hit,
  className,
  ...props
}: HitsProps<ProductHit>) => {
  const { query } = useSearchBox()
  const { hits } = useHits(props)

  return (
    <div
      className={clx(
        "transition-[height,max-height,opacity] duration-300 ease-in-out sm:overflow-hidden w-full sm:w-[50vw] mb-1 p-px",
        className,
        {
          "max-h-full opacity-100": !!query,
          "max-h-0 opacity-0": !query && !hits.length,
        }
      )}
    >
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4"
        data-testid="search-results"
      >
        {hits.slice(0, 6).map((hit, index) => (
          <li
            key={index}
            className={clx("list-none", {
              "hidden sm:block": index > 2,
            })}
          >
            <Hit hit={hit as unknown as ProductHit} />
          </li>
        ))}
      </div>
      <ShowAll />
    </div>
  )
}

export default Hits
