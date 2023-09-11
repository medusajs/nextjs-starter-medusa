import { NextRequest, NextResponse } from "next/server"
import { initialize as initializeProductModule } from "@medusajs/product"
import { ProductCategoryDTO, ProductDTO } from "@medusajs/types/dist/product"
import { notFound } from "next/navigation"
import getPrices from "@lib/util/get-product-prices"
import filterProductsByStatus from "@lib/util/filter-products-by-status"

type ProductCategoryResponse = ProductCategoryDTO & {
  products: ProductDTO[]
}

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

  const { category } = params

  const searchParams = Object.fromEntries(request.nextUrl.searchParams)
  const { offset, limit, cart_id } = searchParams

  const {
    [0]: { products, ...categoryMeta },
  } = (await productService
    .listCategories(
      {
        handle: category,
      },
      {
        relations: [
          "products",
          "products.variants",
          "products.variants.options",
          "products.tags",
          "products.options",
          "products.status",
          "category_children",
        ],
        select: ["id", "handle", "name", "description"],
        take: 1,
      }
    )
    .catch((e) => {
      return notFound()
    })) as ProductCategoryResponse[]

  const publishedProducts = filterProductsByStatus(products, "published")

  const count = publishedProducts.length || 0

  const offsetInt = parseInt(offset) || 0
  const limitInt = parseFloat(limit) || 12

  const productsSlice = publishedProducts.slice(offsetInt, offsetInt + limitInt)

  const productsWithPrices = await getPrices(productsSlice, cart_id)

  const nextPage = offsetInt + limitInt

  return NextResponse.json({
    product_categories: [categoryMeta],
    response: {
      products: productsWithPrices,
      count,
    },
    nextPage: count > nextPage ? nextPage : null,
  })
}
