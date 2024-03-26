import { Text } from "@medusajs/ui"

import { ProductPreviewType } from "types/global"

import { listAuctions, retrievePricedProductById } from "@lib/data"
import { getProductPrice } from "@lib/util/get-product-price"
import { Region } from "@medusajs/medusa"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
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

  const auction = await listAuctions(pricedProduct.id!).then(
    ({ auctions }) => auctions[0]
  )

  const maxBid = auction?.bids?.reduce((a, b) => {
    return Math.max(a, b.amount)
  }, 0)

  const currentBid = maxBid
    ? formatAmount({
        amount: maxBid || auction?.starting_price,
        region,
      })
    : "No active auction"

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
        <div className="flex txt-compact-medium mt-4 justify-between">
          <Text className="text-ui-fg-subtle" data-testid="product-title">{productPreview.title}</Text>
          <div className="flex items-center gap-x-2">
            <Text className="text-ui-fg-muted">{currentBid}</Text>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
