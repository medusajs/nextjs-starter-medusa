import clsx from "clsx"
import React from "react"
import { useHits, UseHitsProps } from "react-instantsearch-hooks-web"
import { ProductHit } from "../hit"

type HitsProps<THit> = React.ComponentProps<"div"> &
  UseHitsProps & {
    hitComponent: (props: { hit: THit }) => JSX.Element
  }

const DesktopHits = ({
  hitComponent: Hit,
  className,
  ...props
}: HitsProps<ProductHit>) => {
  const { hits } = useHits(props)

  return (
    <div
      className={clsx(
        "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden",
        className,
        {
          "max-h-[1000px] opacity-100": !!hits.length,
          "max-h-0 opacity-0": !hits.length,
        }
      )}
    >
      <div className="grid grid-cols-1">
        {hits.map((hit, index) => (
          <li key={index} className="list-none">
            <Hit hit={hit as unknown as ProductHit} />
          </li>
        ))}
      </div>
    </div>
  )
}

export default DesktopHits
