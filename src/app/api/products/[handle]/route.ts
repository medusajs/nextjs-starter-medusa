import { NextResponse, NextRequest } from "next/server"
import { initialize as initializeProductModule } from "@medusajs/product"

/**
 * This endpoint uses the serverless Product Module to retrieve a product by handle.
 * The module connects directly to your Medusa database to retrieve and manipulate data, without the need for a dedicated server.
 * Read more about the Product Module here: https://docs.medusajs.com/modules/products/serverless-module
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, any> }
) {
  // Extract the query parameters
  const { handle } = params

  // Initialize the Product Module
  const productService = await initializeProductModule()

  // Run the query
  const products = await productService.list(
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

  // Return the response
  return NextResponse.json({ products })
}
