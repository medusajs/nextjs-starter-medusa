import { NextRequest, NextResponse } from "next/server"
import { notFound } from "next/navigation"

import { initialize as initializeProductModule } from "@medusajs/product"
import { MedusaApp, Modules } from "@medusajs/modules-sdk"
import { ProductCollectionDTO, ProductDTO } from "@medusajs/types/dist/product"
import { IPricingModuleService } from "@medusajs/types"
import { getPricesByPriceSetId } from "@lib/util/get-prices-by-price-set-id"

/**
 * This endpoint uses the serverless Product Module to retrieve a collection and its products by handle.
 * The module connects directly to your Medusa database to retrieve and manipulate data, without the need for a dedicated server.
 * Read more about the Product Module here: https://docs.medusajs.com/modules/products/serverless-module
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, any> }
) {
  // Initialize the Product Module
  const productService = await initializeProductModule()

  // Extract the query parameters
  const { handle } = params

  const searchParams = Object.fromEntries(request.nextUrl.searchParams)
  const { page, limit } = searchParams

  // Fetch the collections
  const collections = await productService.listCollections()

  // Create a map of collections by handle
  const collectionsByHandle = new Map<string, ProductCollectionDTO>()

  for (const collection of collections) {
    collectionsByHandle.set(collection.handle, collection)
  }

  // Fetch the collection by handle
  const collection = collectionsByHandle.get(handle)

  if (!collection) {
    return notFound()
  }

  // Fetch the products by collection id
  const {
    rows: products,
    metadata: { count },
  } = await getProductsByCollectionId(collection.id, searchParams)

  // Filter out unpublished products
  const publishedProducts: ProductDTO[] = products.filter(
    (product) => product.status === "published"
  )

  // Calculate the next page
  const nextPage = parseInt(page) + parseInt(limit)

  // Return the response
  return NextResponse.json({
    collections: [collection],
    response: {
      products: publishedProducts,
      count,
    },
    nextPage: count > nextPage ? nextPage : null,
  })
}

/**
 * This endpoint uses the serverless Product and Pricing Modules to retrieve a product list.
 * @param collection_id The collection id to filter by
 * @param params The query parameters
 * @returns The products and metadata
 */
async function getProductsByCollectionId(
  collection_id: string,
  params: Record<string, any>
): Promise<{ rows: ProductDTO[]; metadata: Record<string, any> }> {
  // Extract the query parameters
  let { currency_code } = params

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
  })

  // Set the filters for the query
  const filters = {
    take: parseInt(params.limit) || 100,
    skip: parseInt(params.offset) || 0,
    filters: {
      collection_id: [collection_id],
    },
    currency_code,
  }

  // Set the GraphQL query
  const productsQuery = `#graphql
    query($filters: Record, $take: Int, $skip: Int) {
      products(filters: $filters, take: $take, skip: $skip) {
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

  // Run the query
  const { rows, metadata } = await query(productsQuery, filters)

  // Calculate prices
  const productsWithPrices = await getPricesByPriceSetId({
    products: rows,
    currency_code,
    pricingService: modules.pricingService as unknown as IPricingModuleService,
  })

  // Return the response
  return {
    rows: productsWithPrices,
    metadata,
  }
}
