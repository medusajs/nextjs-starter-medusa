import { getTranslations } from "next-intl/server"

import { listProducts } from "@/utils/data/products"
import { getRegion } from "@/utils/data/regions"

import { ProductPreview } from "@/components/modules/product/product-preview"

import type { HttpTypes } from "@medusajs/types"

type Props = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

async function RelatedProducts({ product, countryCode }: Props) {
  const t = await getTranslations("modules.product.related_products")
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const queryParams: HttpTypes.StoreProductParams = {}
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection_id) {
    // @ts-ignore - collection_id is a required parameter
    queryParams.collection_id = [product.collection_id]
  }
  if (product.tags) {
    // @ts-ignore - tag_id is a required parameter
    queryParams.tag_id = product.tags
      .map((t) => t.id)
      .filter(Boolean) as string[]
  }
  // @ts-ignore - is_giftcard is a required parameter
  queryParams.is_giftcard = false

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id
    )
  })

  if (!products.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-base text-muted-foreground mb-2">
          {t("title")}
        </span>
        <p className="text-2xl text-foreground max-w-lg">{t("description")}</p>
      </div>

      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <li key={product.id}>
            <ProductPreview region={region} product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export { RelatedProducts }
export type { Props as RelatedProductsProps }
