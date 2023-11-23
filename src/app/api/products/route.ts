import { NextRequest, NextResponse } from "next/server"
import { notFound } from "next/navigation"

import { MedusaApp, Modules } from "@medusajs/modules-sdk"
import { getPricesByPriceSetId } from "@lib/util/get-prices-by-price-set-id"
import { IPricingModuleService } from "@medusajs/types"

/**
 * This endpoint uses the serverless Product and Pricing Modules to retrieve a product list.
 * The modules connect directly to your Medusa database to retrieve and manipulate data, without the need for a dedicated server.
 * Read more about the Product Module here: https://docs.medusajs.com/modules/products/serverless-module
 */
export async function GET(request: NextRequest) {
  const queryParams = Object.fromEntries(request.nextUrl.searchParams)

  const response = await getProducts(queryParams)

  if (!response) {
    return notFound()
  }

  return NextResponse.json(response)
}

async function getProducts(params: Record<string, any>) {
  // Extract the query parameters
  let { id, limit, offset, currency_code } = params

  offset = offset && parseInt(offset)
  limit = limit && parseInt(limit)
  currency_code = currency_code && currency_code.toUpperCase()

  // Initialize Remote Query with the Product and Pricing Modules
  const { query, modules } = await MedusaApp({
    modulesConfig: {
      [Modules.PRODUCT]: true,
      [Modules.PRICING]: true,
    },
    sharedResourcesConfig: {
      database: { clientUrl: process.env.POSTGRES_URL },
    },
    injectedDependencies: {},
  })

  // Set the filters for the query
  const filters = {
    take: limit || 12,
    skip: offset || 0,
    id: id ? [id] : undefined,
    context: { currency_code },
  }

  // Set the GraphQL query
  const productsQuery = `#graphql
    query($filters: Record, $id: String, $take: Int, $skip: Int) {
      products(filters: $filters, id: $id, take: $take, skip: $skip) {
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
          price {
            price_set {
              id
            }
          }
        }
      }
    }`

  const {
    rows: products,
    metadata: { count },
  } = await query(productsQuery, filters)

  // Calculate prices
  const productsWithPrices = await getPricesByPriceSetId({
    products,
    currency_code,
    pricingService: modules.pricingService as unknown as IPricingModuleService,
  })

  // Calculate the next page
  const nextPage = offset + limit

  // Return the response
  return {
    products: productsWithPrices,
    count: count,
    nextPage: count > nextPage ? nextPage : null,
  }
}
