import { NextRequest, NextResponse } from "next/server"
import { initialize as initializeProductModule } from "@medusajs/product"
import { notFound } from "next/navigation"

/**
 * This endpoint uses the serverless Product Module to list and count all product collections.
 * The module connects directly to you Medusa database to retrieve and manipulate data, without the need for a dedicated server.
 * Read more about the Product Module here: https://docs.medusajs.com/modules/products/serverless-module
 */
export async function GET(request: NextRequest) {
  const productService = await initializeProductModule()

  const { offset } = Object.fromEntries(request.nextUrl.searchParams)

  const [collections, count] = await productService.listAndCountCollections(
    {},
    {
      skip: parseInt(offset) || 0,
      take: 100,
    }
  )

  return NextResponse.json({
    collections,
    count,
  })
}
