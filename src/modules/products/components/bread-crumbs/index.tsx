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
        "product-page-constraint flex items-center gap-x-4 py-4",
        className
      )}
      {...rest}
    >
      <div className="flex items-center gap-x-2 text-small-regular text-gray-700">
        <Link href="/" passHref>
          <a>Home</a>
        </Link>
        <span>/</span>
        <Link href="/shop" passHref>
          <a>Shop</a>
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
    </div>
  )
}

export default BreadCrumbs
