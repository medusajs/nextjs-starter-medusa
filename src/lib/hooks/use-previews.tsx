import { Region } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { useMemo } from "react"

import sortProducts from "@lib/util/sort-products"
import transformProductPreview from "@lib/util/transform-product-preview"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { InfiniteProductPage, ProductPreviewType } from "types/global"

type UsePreviewProps<T> = {
  pages?: T[]
  region?: Region
  sortBy?: SortOptions
}

const usePreviews = <T extends InfiniteProductPage>({
  pages,
  region,
  sortBy,
}: UsePreviewProps<T>) => {
  const previews: ProductPreviewType[] = useMemo(() => {
    if (!pages || !region) {
      return []
    }

    const products: PricedProduct[] = []

    for (const page of pages) {
      products.push(...page.response.products)
    }

    const transformedProducts = products.map((p) =>
      transformProductPreview(p, region)
    )

    sortBy && sortProducts(transformedProducts, sortBy)

    return transformedProducts
  }, [pages, region, sortBy])

  return previews
}

export default usePreviews
