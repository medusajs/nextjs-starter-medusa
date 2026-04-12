import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const seriesName =
    product.collection?.title ?? product.tags?.[0]?.value ?? null

  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div className="flex h-full w-full flex-col" data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
        />
        <div className="mt-[15px] flex min-w-0 flex-col sm:mt-[9px] md:mt-[1px]">
          {seriesName ? (
            <span className="font-sans text-[12px] font-light uppercase leading-[18px] tracking-[0.18px] text-qw-medium-grey">
              {seriesName}
            </span>
          ) : null}
          <div className="mt-[3px] flex min-h-[20px] items-center justify-center">
            <Text
              className="text-center font-sans text-[12px] font-light leading-[18px] tracking-[0.18px] text-qw-charcoal"
              data-testid="product-title"
            >
              {product.title}
            </Text>
          </div>
          <div className="mt-3 flex w-full items-baseline justify-center gap-x-2">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
