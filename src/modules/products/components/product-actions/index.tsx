import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"

import { retrievePricedProductById } from "@lib/data"
import { getRegion } from "app/actions"

import ProductActionsInner from "./inner"

export default async function ProductActions({
  product,
}: {
  product: PricedProduct
}) {
  if (!product.id) {
    return <>Error getting product actions</>
  }

  const region = await getRegion().then((region) => region)

  if (!region) {
    return <>Error getting product actions</>
  }

  const pricedProduct = await retrievePricedProductById({
    id: product.id,
    regionId: region.id,
  }).then((product) => product)

  if (!pricedProduct) {
    return <>Error getting product actions</>
  }

  return <ProductActionsInner region={region} product={pricedProduct} />
}
