import { NextResponse, NextRequest } from "next/server"
import getPrices from "@lib/util/get-product-prices"

import { initialize as initializeProductModule } from "@medusajs/product"
import { FilterableProductProps } from "@medusajs/types/dist/product/common"

export async function GET(request: NextRequest) {
  const productService = await initializeProductModule()

  const { id, limit, offset, cart_id } = Object.fromEntries(
    request.nextUrl.searchParams
  )

  const filters = {} as FilterableProductProps

  if (id) {
    filters.id = id.split(",")
  }

  const [data, count] = await productService.listAndCount(filters, {
    relations: ["variants", "variants", "tags", "status"],
    take: parseInt(limit) || 100,
    skip: parseInt(offset) || 0,
    withDeleted: false,
  })

  const publishedProducts = data.filter(
    (product) => product.status === "published"
  )

  const productsWithPrices = await getPrices(publishedProducts, cart_id)

  const nextPage = parseInt(offset) + parseInt(limit)

  return NextResponse.json({
    products: productsWithPrices,
    count,
    nextPage: count > nextPage ? nextPage : null,
  })
}
