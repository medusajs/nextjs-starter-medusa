import { NextRequest, NextResponse } from "next/server"
import { initialize as initializeProductModule } from "@medusajs/product"
import { ProductDTO } from "@medusajs/types/dist/product"
import { notFound } from "next/navigation"
import { MedusaApp, Modules } from "@medusajs/modules-sdk"

/**
 * This endpoint uses the serverless Product Module to retrieve a category and its products by handle.
 * The module connects directly to you Medusa database to retrieve and manipulate data, without the need for a dedicated server.
 * Read more about the Product Module here: https://docs.medusajs.com/modules/products/serverless-module
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, any> }
) {
  const productService = await initializeProductModule()

  const searchParams = Object.fromEntries(request.nextUrl.searchParams)
  const { page, limit } = searchParams

  let { category: categoryHandle } = params

  const handle = categoryHandle.map((handle: string, index: number) => {
    return categoryHandle.slice(0, index + 1).join("/")
  })

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

  const {
    rows: products,
    metadata: { count },
  } = await getProductsByCategoryId(category.id, searchParams)

  const publishedProducts: ProductDTO[] = products.filter(
    (product) => product.status === "published"
  )

  const nextPage = parseInt(page) + parseInt(limit)

  return NextResponse.json({
    product_categories: Object.values(product_categories),
    response: {
      products: publishedProducts,
      count,
    },
    nextPage: count > nextPage ? nextPage : null,
  })
}

async function getProductsByCategoryId(
  category_id: string,
  params: Record<string, any>
): Promise<{ rows: ProductDTO[]; metadata: Record<string, any> }> {
  // Extract the query parameters
  let { currency_code } = params

  currency_code = currency_code && currency_code.toUpperCase()

  const { query, modules } = await MedusaApp({
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
      category_id: [category_id],
    },
    currency_code,
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
            price {
              price_set {
                id
              }
          }
        }
      }
    }`

  const { rows, metadata } = await query(productsQuery, filters)

  for (const product of rows) {
    for (const variant of product.variants) {
      const priceSetIds = variant.price.map((price) => price.price_set.id)

      const prices = await modules.pricingService.calculatePrices(
        { id: priceSetIds },
        {
          context: { currency_code },
        }
      )

      const price = prices.find(
        (price) => price.currency_code === currency_code
      )

      if (!price) continue

      delete variant.price
      variant.price = price
      variant.calculated_price = price.amount
    }
  }

  return {
    rows,
    metadata,
  }
}
