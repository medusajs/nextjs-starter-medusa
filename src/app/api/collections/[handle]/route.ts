import { NextRequest, NextResponse } from "next/server"
import { initialize as initializeProductModule } from "@medusajs/product"
import { ProductCollectionDTO } from "@medusajs/types/dist/product"
import { notFound } from "next/navigation"
import getPrices from "@lib/util/get-product-prices"

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
  const { page, limit, cart_id } = searchParams

  const collections = await productService.listCollections()

  const collectionsByHandle = new Map<string, ProductCollectionDTO>()

  for (const collection of collections) {
    collectionsByHandle.set(collection.handle, collection)
  }

  const collection = collectionsByHandle.get(handle)

  if (!collection) {
    return notFound()
  }

  const count = collection.products?.length || 0

  const { products, ...collectionMeta } =
    await productService.retrieveCollection(collection.id, {
      relations: [
        "products",
        "products.variants",
        "products.variants.options",
        "products.tags",
        "products.options",
        "products.status",
      ],
      take: parseInt(limit) || 100,
      skip: parseInt(page) || 0,
    })

  if (!products) {
    return notFound()
  }

  const publishedProducts = products.filter(
    (product) => product.status === "published"
  )

  const productsWithPrices = await getPrices(publishedProducts, cart_id)

  const nextPage = parseInt(page) + parseInt(limit)

  return NextResponse.json({
    collections: [collectionMeta],
    response: {
      products: productsWithPrices,
      count,
    },
    nextPage: count > nextPage ? nextPage : null,
  })
}
