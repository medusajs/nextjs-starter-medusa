import { NextResponse, NextRequest } from "next/server"

import { MedusaApp, Modules } from "@medusajs/modules-sdk"

/**
 * This endpoint uses the serverless Product and Pricing Modules to retrieve a product by handle.
 * The modules connect directly to your Medusa database to retrieve and manipulate data, without the need for a dedicated server.
 * Read more about the Product Module here: https://docs.medusajs.com/modules/products/serverless-module
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, any> }
) {
  // Extract the query parameters
  const { handle } = params

  // Initialize Remote Query with the Product and Pricing Modules
  const { query } = await MedusaApp({
    modulesConfig: [
      {
        module: Modules.PRODUCT,
        path: "@medusajs/product",
      },
      {
        module: Modules.PRICING,
        path: "@medusajs/pricing",
      },
    ],
    sharedResourcesConfig: {
      database: { clientUrl: process.env.POSTGRES_URL },
    },
  })

  // Set the filters for the query
  const filters = {
    handle,
    take: 1,
  }

  // Set the GraphQL query
  const productsQuery = `#graphql
    query($handle: String, $take: Int) {
      products(handle: $handle, take: $take) {
        id
        title
        handle
        tags
        status
        collection
        collection_id
        thumbnail
        images {
            url
            alt_text
            id
        }
        options {
            id
            value
            title
        }
        variants {
            id
            title
            created_at
            updated_at
            thumbnail
            inventory_quantity
            material
            weight
            length
            height
            width
            options {
                id
                value
                title
            }
        }
      }
    }`

  // Run the query
  const data = await query(productsQuery, filters)

  // Format the response
  // const products = formatModuleResponse(data)
  const products = data

  // Return the response
  return NextResponse.json({ products })
}
