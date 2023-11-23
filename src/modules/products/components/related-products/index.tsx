import usePreviews from "@lib/hooks/use-previews"
import getNumberOfSkeletons from "@lib/util/get-number-of-skeletons"
import repeat from "@lib/util/repeat"
import { StoreGetProductsParams } from "@medusajs/medusa"
import { Button } from "@medusajs/ui"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import { useCart } from "medusa-react"
import { useMemo } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import ProductPreview from "../product-preview"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { getProductsList } from "@lib/data"

type RelatedProductsProps = {
  product: PricedProduct
}

const RelatedProducts = ({ product }: RelatedProductsProps) => {
  const { cart } = useCart()

  const queryParams: StoreGetProductsParams = useMemo(() => {
    const params: StoreGetProductsParams = {}

    if (cart?.id) {
      params.cart_id = cart.id
    }

    if (cart?.region?.currency_code) {
      params.currency_code = cart.region.currency_code
    }

    if (product.collection_id) {
      params.collection_id = [product.collection_id]
    }

    if (product.tags) {
      params.tags = product.tags.map((t) => t.value)
    }

    params.is_giftcard = false

    return params
  }, [product, cart?.id, cart?.region])

  const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery(
      [`infinite-products-${product.id}`, queryParams, cart],
      ({ pageParam }) => getProductsList({ pageParam, queryParams }),
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
      }
    )

  const previews = usePreviews({ pages: data?.pages, region: cart?.region })

  return (
    <div className="product-page-constraint">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-base-regular text-gray-600 mb-6">
          Related products
        </span>
        <p className="text-2xl-regular text-gray-900 max-w-lg">
          You might also want to check out these products.
        </p>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {previews.map((p) => (
          <li key={p.id}>
            <ProductPreview {...p} />
          </li>
        ))}
        {isLoading &&
          !previews.length &&
          repeat(8).map((index) => (
            <li key={index}>
              <SkeletonProductPreview />
            </li>
          ))}
        {isFetchingNextPage &&
          repeat(getNumberOfSkeletons(data?.pages)).map((index) => (
            <li key={index}>
              <SkeletonProductPreview />
            </li>
          ))}
      </ul>
      {hasNextPage && (
        <div className="flex items-center justify-center mt-8">
          <Button
            isLoading={isLoading}
            onClick={() => fetchNextPage()}
            className="w-72"
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  )
}

export default RelatedProducts
