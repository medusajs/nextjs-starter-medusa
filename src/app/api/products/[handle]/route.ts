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
  const { handle } = params

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

  const productsQuery = `#graphql
    query {
      products(handle: "${handle}", take: 1) {
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
            prices {
                money_amount {
                  amount
                  currency_code
                }
            }
            options {
                id
                value
                title
            }
        }
      }
    }`

  const products = await query(productsQuery)

  return NextResponse.json({ products })
}
