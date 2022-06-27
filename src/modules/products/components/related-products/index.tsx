import { medusaClient } from "@lib/config"
import { Product, Region, StoreGetProductsParams } from "@medusajs/medusa"
import Button from "@modules/common/components/button"
import Spinner from "@modules/common/icons/spinner"
import clsx from "clsx"
import { formatAmount, useCart } from "medusa-react"
import { useMemo } from "react"
import { useInfiniteQuery } from "react-query"
import { CalculatedVariant } from "types/medusa"
import Thumbnail from "../thumbnail"

type RelatedProductsProps = {
  product: Product
}

const RelatedProducts = ({ product }: RelatedProductsProps) => {
  const { cart } = useCart()

  const queryParams: StoreGetProductsParams = useMemo(() => {
    const params: StoreGetProductsParams = {}

    if (cart) {
      params.cart_id = cart.id
    }

    if (product.collection_id) {
      params.collection_id = [product.collection_id]
    }

    if (product.type) {
      params.type = product.type.id
    }

    if (product.tags) {
      params.tags = product.tags.map((t) => t.value)
    }

    return params
  }, [product, cart])

  const { data, hasNextPage, fetchNextPage, isLoading } = useInfiniteQuery(
    [`infinite-products_${product.id}`, queryParams, cart?.region],
    ({ pageParam }) => fetchProducts({ pageParam, queryParams }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      enabled: !!cart,
    }
  )

  return (
    <div className="product-page-constraint">
      <h3 className="text-large-regular text-lg mb-4">Related products</h3>
      {!data || !cart?.region ? (
        <div className="w-full flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <ul className="grid grid-cols-6 gap-x-4 gap-y-8">
          {data?.pages.map((page) => {
            return page.response.products
              .filter((p) => p.id !== product.id)
              .map((p) => {
                return (
                  <li key={p.id}>
                    <ProductPreview product={p} region={cart.region} />
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

const ProductPreview = ({
  product,
  region,
}: {
  product: Product
  region: Region
}) => {
  const variant = product.variants[0] as CalculatedVariant

  const onSale = variant.calculated_price < variant.original_price

  return (
    <div>
      <Thumbnail
        thumbnail={product.thumbnail}
        images={product.images}
        size="full"
      />
      <div className="text-base-regular mt-2 w-full flex flex-col">
        <span>{product.title}</span>
        <div className="flex items-center gap-x-2">
          {onSale && (
            <span className="line-through text-gray-500">
              {formatAmount({
                amount: variant.original_price,
                region: region,
                includeTaxes: false,
              })}
            </span>
          )}
          <span
            className={clsx("font-semibold", {
              "text-rose-500": onSale,
            })}
          >
            {formatAmount({
              amount: variant.calculated_price,
              region: region,
              includeTaxes: false,
            })}
          </span>
        </div>
      </div>
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
    limit: 6,
    offset: pageParam,
    ...queryParams,
  })

  return {
    response: { products, count },
    nextPage: count > offset + 4 ? offset + 4 : null,
  }
}

export default RelatedProducts
