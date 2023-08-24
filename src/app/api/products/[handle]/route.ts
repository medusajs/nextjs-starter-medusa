import { NextResponse, NextRequest } from "next/server"
import getPrices from "@lib/util/get-product-prices"

import { initialize as initializeProductModule } from "@medusajs/product"

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, any> }
) {
  const { handle } = params
  const { limit, cart_id } = Object.fromEntries(request.nextUrl.searchParams)
  const productService = await initializeProductModule()

  const data = await productService.list(
    { handle },
    {
      relations: [
        "variants",
        "variants.options",
        "tags",
        "options",
        "images",
        "description",
        "collection",
      ],
      take: parseInt(limit) || 100,
    }
  )

  const productsWithPrices = await getPrices(data, cart_id)

  return NextResponse.json({ product: productsWithPrices[0] })
}
