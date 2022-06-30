import { medusaClient } from "@lib/config"
import { Product, StoreGetProductsParams } from "@medusajs/medusa"
import Button from "@modules/common/components/button"
import Spinner from "@modules/common/icons/spinner"
import { useMemo } from "react"
import { useInfiniteQuery } from "react-query"
import ProductPreview from "../product-preview"

type RelatedProductsProps = {
  product: Product
}

const RelatedProducts = ({ product }: RelatedProductsProps) => {
  const queryParams: StoreGetProductsParams = useMemo(() => {
    const params: StoreGetProductsParams = {}
    if (product.collection_id) {
      params.collection_id = [product.collection_id]
    }

    if (product.type) {
      params.type = product.type.id
    }

    if (product.tags) {
      params.tags = product.tags.map((t) => t.value)
    }

    params.is_giftcard = false

    return params
  }, [product])

  const { data, hasNextPage, fetchNextPage, isLoading } = useInfiniteQuery(
    [`infinite-products_${product.id}`, queryParams],
    ({ pageParam }) => fetchProducts({ pageParam, queryParams }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  )

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
      {!data ? (
        <div className="w-full flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-4 gap-y-8">
          {data?.pages.map((page) => {
            return page.response.products
              .filter((p) => p.id !== product.id)
              .map((p) => {
                return (
                  <li key={p.id}>
                    <ProductPreview product={p} />
                  </li>
                )
              })
          })}
        </ul>
      )}
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

type FetchProductParams = {
  pageParam?: number
  queryParams: StoreGetProductsParams
}

const fetchProducts = async ({
  pageParam = 0,
  queryParams,
}: FetchProductParams) => {
  const { products, count, offset } = await medusaClient.products.list({
    limit: 24,
    offset: pageParam,
    ...queryParams,
  })

  return {
    response: { products, count },
    nextPage: count > offset + 24 ? offset + 24 : null,
  }
}

export default RelatedProducts
