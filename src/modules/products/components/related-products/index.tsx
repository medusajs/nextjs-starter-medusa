import { StoreGetProductsParams } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"

import { getProductsList } from "@lib/data"

import ProductPreview from "../product-preview"
import { getRegion } from "app/actions"
import transformProductPreview from "@lib/util/transform-product-preview"

type RelatedProductsProps = {
  product: PricedProduct
}

export default async function RelatedProducts({
  product,
}: RelatedProductsProps) {
  const region = await getRegion()

  if (!region) {
    return null
  }

  // edit this function to define your related products logic
  const setQueryParams = (): StoreGetProductsParams => {
    const params: StoreGetProductsParams = {}

    if (region?.id) {
      params.region_id = region.id
    }

    if (region?.currency_code) {
      params.currency_code = region.currency_code
    }

    if (product.collection_id) {
      params.collection_id = [product.collection_id]
    }

    if (product.tags) {
      params.tags = product.tags.map((t) => t.value)
    }

    params.is_giftcard = false

    return params
  }

  const queryParams = setQueryParams()

  const products = await getProductsList({ queryParams }).then(({ response }) =>
    response.products
      .map((product) => transformProductPreview(product, region))
      .filter((p) => p.id !== product.id)
  )

  if (!products.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-base-regular text-gray-600 mb-6">
          Related products
        </span>
        <p className="text-2xl-regular text-ui-fg-base max-w-lg">
          You might also want to check out these products.
        </p>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {products.map((p) => (
          <li key={p.id}>
            <ProductPreview {...p} />
          </li>
        ))}
      </ul>
    </div>
  )
}
