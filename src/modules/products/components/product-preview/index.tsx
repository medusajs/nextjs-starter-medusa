import { Text } from "@medusajs/ui"

import { ProductPreviewType } from "types/global"

import { retrievePricedProductById } from "@lib/data"
import { Region } from "@medusajs/medusa"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import { formatAmount } from "@lib/util/prices"


export default async function ProductPreview({
  productPreview,
  isFeatured,
  region,
}: {
  productPreview: ProductPreviewType
  isFeatured?: boolean
  region: Region
}) {
  const pricedProduct = await retrievePricedProductById({
    id: productPreview.id,
    regionId: region.id,
  }).then((product) => product)

  if (!pricedProduct) {
    return null
  } 

  // TODO refactor this function somewhere globally as our region will never change and it is duplicated a lot
  // formats the product price to incl GST
  const getAmount = (amount: number | null | undefined) => {
    return formatAmount({
      amount: amount || 0,
      region: region,
      includeTaxes: false,
    })
  }

    // Store the product price in a variable
    const priceInclGst = getAmount(pricedProduct.variants[0]?.original_price_incl_tax)

  return (
    <LocalizedClientLink
      href={`/products/${productPreview.handle}`}
      className="group"
    >
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={productPreview.thumbnail}
          size="full"
          isFeatured={isFeatured}
        />
        <div className="flex justify-between mt-4 txt-compact-medium">
          <Text className="text-ui-fg-subtle" data-testid="product-title">{productPreview.title}</Text>
          <div className="flex items-center gap-x-2">
          {priceInclGst}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
