import { NextRequest, NextResponse } from "next/server"
import { initialize as initializeProductModule } from "@medusajs/product"
import { notFound } from "next/navigation"

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

  if (!collections) {
    return notFound()
  }

  return NextResponse.json({
    collections,
    count,
  })
}
