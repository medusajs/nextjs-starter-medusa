import transformProductPreview from "@lib/util/transform-product-preview"
import { Product, Region } from "@medusajs/medusa"
import { useMemo } from "react"
import { InfiniteProductPage, ProductPreviewType } from "types/global"

type UsePreviewProps<T> = {
  pages?: T[]
  region?: Region
}

const usePreviews = <T extends InfiniteProductPage>({
  pages,
  region,
}: UsePreviewProps<T>) => {
  const previews: ProductPreviewType[] = useMemo(() => {
    if (!pages || !region) {
      return []
    }

    const products: Product[] = []

    for (const page of pages) {
      products.push(...page.response.products)
    }

    const transformedProducts = products.map((p) =>
      transformProductPreview(p, region)
    )

    return transformedProducts
  }, [pages, region])

  return previews
}

export default usePreviews
