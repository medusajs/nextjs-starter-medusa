"use client"

import usePreviews from "@lib/hooks/use-previews"
import {
  ProductCategoryWithChildren,
  getProductsByCategoryHandle,
} from "@lib/data"
import getNumberOfSkeletons from "@lib/util/get-number-of-skeletons"
import repeat from "@lib/util/repeat"
import ProductPreview from "@modules/products/components/product-preview"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useCart } from "medusa-react"
import React, { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import Link from "next/link"
import UnderlineLink from "@modules/common/components/interactive-link"
import { notFound } from "next/navigation"

type CategoryTemplateProps = {
  categories: ProductCategoryWithChildren[]
}

const CategoryTemplate: React.FC<CategoryTemplateProps> = ({ categories }) => {
  const { cart } = useCart()
  const { ref, inView } = useInView()

  const category = categories[categories.length - 1]
  const parents = categories.slice(0, categories.length - 1)

  if (!category) notFound()

  const {
    data: infiniteData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(
    [`get_category_products`, category.handle, cart?.id],
    ({ pageParam }) =>
      getProductsByCategoryHandle({
        pageParam,
        handle: category.handle!,
        cartId: cart?.id,
        currencyCode: cart?.region?.currency_code,
      }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  )

  useEffect(() => {
    if (cart?.region_id) {
      refetch()
    }
  }, [cart?.region_id, refetch])

  const previews = usePreviews({
    pages: infiniteData?.pages,
    region: cart?.region,
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, hasNextPage])

  return (
    <div className="content-container py-6">
      <div className="flex flex-row mb-8 text-2xl-semi gap-4">
        {parents &&
          parents.map((parent) => (
            <span key={parent.id} className="text-gray-500">
              <Link
                className="mr-4 hover:text-black"
                href={`/${parent.handle}`}
              >
                {parent.name}
              </Link>
              /
            </span>
          ))}
        <h1>{category.name}</h1>
      </div>
      {category.description && (
        <div className="mb-8 text-base-regular">
          <p>{category.description}</p>
        </div>
      )}
      {category.category_children && (
        <div className="mb-8 text-base-large">
          <ul className="grid grid-cols-1 gap-2">
            {category.category_children?.map((c) => (
              <li key={c.id}>
                <UnderlineLink href={`/${c.handle}`}>{c.name}</UnderlineLink>
              </li>
            ))}
          </ul>
        </div>
      )}
      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {previews.map((p) => (
          <li key={p.id}>
            <ProductPreview {...p} />
          </li>
        ))}
        {isFetchingNextPage &&
          repeat(getNumberOfSkeletons(infiniteData?.pages)).map((index) => (
            <li key={index}>
              <SkeletonProductPreview />
            </li>
          ))}
      </ul>
      <div
        className="py-16 flex justify-center items-center text-small-regular text-gray-700"
        ref={ref}
      >
        <span ref={ref}></span>
      </div>
    </div>
  )
}

export default CategoryTemplate
