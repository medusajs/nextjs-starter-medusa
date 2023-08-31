import { NextResponse, NextRequest } from "next/server"
import getPrices from "@lib/util/get-product-prices"

import { initialize as initializeProductModule } from "@medusajs/product"
import {
  FilterableProductProps,
  ProductDTO,
} from "@medusajs/types/dist/product/common"
import { notFound } from "next/navigation"

/**
 * This endpoint uses the serverless Product Module to retrieve a list of products.
 * The module connects directly to you Medusa database to retrieve and manipulate data, without the need for a dedicated server.
 * Read more about the Product Module here: https://docs.medusajs.com/modules/products/serverless-module
 */
export async function GET(request: NextRequest) {
  const queryParams = Object.fromEntries(request.nextUrl.searchParams)

  const { collection_id } = queryParams

  if (collection_id) {
    const response = await getProductsByCollectionId(queryParams)

    if (!response) {
      return notFound()
    }

    return NextResponse.json(response)
  }

  const response = await getProducts(queryParams)

  if (!response) {
    return notFound()
  }

  return NextResponse.json(response)
}

async function getProductsByCollectionId(queryParams: Record<string, any>) {
  const productService = await initializeProductModule()

  const { limit, offset, cart_id, collection_id } = queryParams

  const collectionIds = collection_id.split(",")

  const data = await productService.listCollections(
    { id: collectionIds },
    {
      relations: [
        "products",
        "products.variants",
        "products.tags",
        "products.status",
        "products.collection",
      ],
    }
  )

  const products = data.map((c) => c.products).flat() as ProductDTO[]

  const publishedProducts = filterPublishedProducts(products)

  const count = publishedProducts.length

  const page = publishedProducts.slice(
    parseInt(offset),
    parseInt(offset) + parseInt(limit)
  )

  const productsWithPrices = await getPrices(page, cart_id)

  const nextPage = parseInt(offset) + parseInt(limit)

  return {
    products: productsWithPrices,
    count,
    nextPage: count > nextPage ? nextPage : null,
  }
}

async function getProducts(params: Record<string, any>) {
  const productService = await initializeProductModule()

  const { id, limit, offset, cart_id } = params

  const filters = {} as FilterableProductProps

  if (id) {
    filters.id = id.split(",")
  }

  const [data, count] = await productService.listAndCount(filters, {
    relations: ["variants", "variants", "tags", "status", "collection"],
    take: parseInt(limit) || 100,
    skip: parseInt(offset) || 0,
    withDeleted: false,
  })

  const publishedProducts = filterPublishedProducts(data)

  const productsWithPrices = await getPrices(publishedProducts, cart_id)

  const nextPage = parseInt(offset) + parseInt(limit)

  return {
    products: productsWithPrices,
    count,
    nextPage: count > nextPage ? nextPage : null,
  }
}

function filterPublishedProducts(products: ProductDTO[]) {
  return products.filter((product) => product.status === "published")
}
