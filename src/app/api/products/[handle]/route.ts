import { NextResponse, NextRequest } from "next/server"
import getPrices from "@lib/util/get-product-prices"

import { initialize as initializeProductModule } from "@medusajs/product"

/**
 * This endpoint uses the serverless Product Module to retrieve a product by handle.
 * The module connects directly to you Medusa database to retrieve and manipulate data, without the need for a dedicated server.
 * Read more about the Product Module here: https://docs.medusajs.com/modules/products/serverless-module
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, any> }
) {
  const { handle } = params
  const { cart_id, region_id } = Object.fromEntries(
    request.nextUrl.searchParams
  )
  const productService = await initializeProductModule()

  const data = await productService.list(
    { handle },
    {
      relations: [
        "variants",
        "variants.options",
        "tags",
        "options",
        "options.values",
        "images",
        "description",
        "collection",
        "status",
      ],
      take: 1,
    }
  )

  const productsWithPrices = await getPrices(data, cart_id, region_id)

  return NextResponse.json({ products: productsWithPrices })
}
