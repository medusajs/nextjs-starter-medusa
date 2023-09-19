import { NextRequest, NextResponse } from "next/server"
import { initialize as initializeProductModule } from "@medusajs/product"
import { ProductDTO } from "@medusajs/types/dist/product"
import { IPricingModuleService } from "@medusajs/types"
import { notFound } from "next/navigation"
import { MedusaApp, Modules } from "@medusajs/modules-sdk"
import { getPricesByPriceSetId } from "@lib/util/get-prices-by-price-set-id"

/**
 * This endpoint uses the serverless Product and Pricing Modules to retrieve a category and its products by handle.
 * The module connects directly to you Medusa database to retrieve and manipulate data, without the need for a dedicated server.
 * Read more about the Product Module here: https://docs.medusajs.com/modules/products/serverless-module
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, any> }
) {
  // Initialize the Product Module
  const productService = await initializeProductModule()

  // Extract the query parameters
  const searchParams = Object.fromEntries(request.nextUrl.searchParams)
  const { page, limit } = searchParams

  let { handle: categoryHandle } = params

  const handle = categoryHandle.map((handle: string, index: number) =>
    categoryHandle.slice(0, index + 1).join("/")
  )

  // Fetch the category by handle
  const product_categories = await productService
    .listCategories(
      {
        handle,
      },
      {
        select: ["id", "handle", "name", "description"],
        relations: ["category_children"],
        take: handle.length,
      }
    )
    .catch((e) => {
      return notFound()
    })

  const category = product_categories[0]

  if (!category) {
    return notFound()
  }

  // Fetch the products by category id
  const {
    rows: products,
    metadata: { count },
  } = await getProductsByCategoryId(category.id, searchParams)

  // Filter out unpublished products
  const publishedProducts: ProductDTO[] = products.filter(
    (product) => product.status === "published"
  )

  // Calculate the next page
  const nextPage = parseInt(page) + parseInt(limit)

  // Return the response
  return NextResponse.json({
    product_categories: Object.values(product_categories),
    response: {
      products: publishedProducts,
      count,
    },
    nextPage: count > nextPage ? nextPage : null,
  })
}

/**
 * This function uses the serverless Product and Pricing Modules to retrieve products by category id.
 * @param category_id The category id
 * @param params The query parameters
 * @returns The products and metadata
 */
async function getProductsByCategoryId(
  category_id: string,
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
      category_id: [category_id],
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
