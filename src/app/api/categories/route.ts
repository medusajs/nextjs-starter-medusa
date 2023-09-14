import { NextRequest, NextResponse } from "next/server"
import { initialize as initializeProductModule } from "@medusajs/product"
import { notFound } from "next/navigation"

/**
 * This endpoint uses the serverless Product Module to list and count all product categories.
 * The module connects directly to your Medusa database to retrieve and manipulate data, without the need for a dedicated server.
 * Read more about the Product Module here: https://docs.medusajs.com/modules/products/serverless-module
 */
export async function GET(request: NextRequest) {
  const productService = await initializeProductModule()

  const { offset, limit } = Object.fromEntries(request.nextUrl.searchParams)

  const [product_categories, count] = await productService
    .listAndCountCategories(
      {},
      {
        select: ["id", "handle", "name", "description", "parent_category"],
        relations: ["category_children"],
        skip: parseInt(offset) || 0,
        take: parseInt(limit) || 100,
      }
    )
    .catch((e) => {
      return notFound()
    })

  return NextResponse.json({
    product_categories,
    count,
  })
}
