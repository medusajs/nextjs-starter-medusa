import { NextRequest, NextResponse } from "next/server"
import { notFound } from "next/navigation"

import { MedusaApp, Modules } from "@medusajs/modules-sdk"
import { formatVariantPrices } from "@lib/util/format-variant-prices"

export async function GET(request: NextRequest) {
  const queryParams = Object.fromEntries(request.nextUrl.searchParams)

  const response = await getProducts(queryParams)

  if (!response) {
    return notFound()
  }

  return NextResponse.json(response)
}

async function getProducts(params: Record<string, any>) {
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

  // Extract the query parameters
  const { id, limit, offset, currency_code } = params

  const offsetInt = parseInt(offset),
    limitInt = parseInt(limit)

  // Set the filters for the query
  const filters = {
    take: limitInt || 12,
    skip: offsetInt || 0,
    id: id ? [id] : undefined,
    currency_code,
  }

  // Set the GraphQL query
  const productsQuery = `#graphql
    query($take: Int, $skip: Int, $withDeleted: bool, $id: [string], $currency_code: string) {
        products(take: $take, skip: $skip, withDeleted: $withDeleted, id: $id) {
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
                prices {
                    money_amount(filters: { currency_code: $currency_code }) {
                        amount
                        currency_code
                    }
                }
            }
        }
  }`

  // Run the query
  const {
    rows,
    metadata: { count },
  } = await query(productsQuery, filters)

  // Format the prices
  const products = formatVariantPrices(rows)

  // Calculate the next page
  const nextPage = offsetInt + limitInt

  // Return the response
  return {
    products,
    count,
    nextPage: count > nextPage ? nextPage : null,
  }
}
