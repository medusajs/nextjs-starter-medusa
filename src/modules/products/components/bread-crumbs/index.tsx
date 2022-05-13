import { ProductCollection } from "@medusajs/medusa"
import clsx from "clsx"
import Link from "next/link"
import React from "react"

type BreadCrumbsProps = {
  collection?: ProductCollection
} & React.HTMLAttributes<HTMLDivElement>

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({
  collection,
  className,
  ...rest
}) => {
  return (
    <div
      className={clsx(
        "flex items-center gap-x-2 text-small-regular text-gray-700",
        className
      )}
      {...rest}
    >
      <Link href="/" passHref>
        <a>Home</a>
      </Link>
      {collection && (
        <>
          <span>/</span>
          <Link href={`/collections/${collection.id}`} passHref>
            <a>{collection.title}</a>
          </Link>
        </>
      )}
    </div>
  )
}

export default BreadCrumbs
