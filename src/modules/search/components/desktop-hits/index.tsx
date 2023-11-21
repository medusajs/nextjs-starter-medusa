import clsx from "clsx"
import React from "react"
import {
  useHits,
  UseHitsProps,
  useSearchBox,
} from "react-instantsearch-hooks-web"
import { ProductHit } from "../hit"
import ShowAll from "../show-all"

type HitsProps<THit> = React.ComponentProps<"div"> &
  UseHitsProps & {
    hitComponent: (props: { hit: THit }) => JSX.Element
    close: () => void
  }

const DesktopHits = ({
  hitComponent: Hit,
  className,
  close,
  ...props
}: HitsProps<ProductHit>) => {
  const { query } = useSearchBox()
  const { hits } = useHits(props)

  return (
    <div
      className={clsx(
        "transition-[height,max-height,opacity] duration-300 ease-in-out overflow-y-scroll w-[50vw] mb-1 p-px",
        className,
        {
          "max-h-full opacity-100": !!query,
          "max-h-0 opacity-0": !query && !hits.length,
        }
      )}
    >
      <div className="grid grid-cols-3 gap-4 mb-4">
        {hits.slice(0, 6).map((hit, index) => (
          <li key={index} className="list-none">
            <Hit hit={hit as unknown as ProductHit} />
          </li>
        ))}
      </div>
      <ShowAll close={close} />
    </div>
  )
}

export default DesktopHits
