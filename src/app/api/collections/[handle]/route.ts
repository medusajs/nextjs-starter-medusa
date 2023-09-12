import { NextRequest, NextResponse } from "next/server"
import { notFound } from "next/navigation"

import { initialize as initializeProductModule } from "@medusajs/product"
import { MedusaApp, Modules } from "@medusajs/modules-sdk"
import { ProductCollectionDTO, ProductDTO } from "@medusajs/types/dist/product"

/**
 * This endpoint uses the serverless Product Module to retrieve a collection and its products by handle.
 * The module connects directly to you Medusa database to retrieve and manipulate data, without the need for a dedicated server.
 * Read more about the Product Module here: https://docs.medusajs.com/modules/products/serverless-module
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, any> }
) {
  const productService = await initializeProductModule()

  const { handle } = params

  const searchParams = Object.fromEntries(request.nextUrl.searchParams)
  const { page, limit } = searchParams

  const collections = await productService.listCollections()

  const collectionsByHandle = new Map<string, ProductCollectionDTO>()

  for (const collection of collections) {
    collectionsByHandle.set(collection.handle, collection)
  }

  const collection = collectionsByHandle.get(handle)

  if (!collection) {
    return notFound()
  }

  const {
    rows: products,
    metadata: { count },
  } = await getProductsByCollectionId(collection.id, searchParams)

  const publishedProducts: ProductDTO[] = products.filter(
    (product) => product.status === "published"
  )

  const nextPage = parseInt(page) + parseInt(limit)

  return NextResponse.json({
    collections: [collection],
    response: {
      products: publishedProducts,
      count,
    },
    nextPage: count > nextPage ? nextPage : null,
  })
}

async function getProductsByCollectionId(
  collection_id: string,
  params: Record<string, any>
): Promise<{ rows: ProductDTO[]; metadata: Record<string, any> }> {
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

  const filters = {
    take: parseInt(params.limit) || 100,
    skip: parseInt(params.offset) || 0,
    filters: {
      collection_id: [collection_id],
    },
  }

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
            prices {
                money_amount {
                  amount
                  currency_code
            }
          }
        }
      }
    }`

  const response = await query(productsQuery, filters)

  return response
}
