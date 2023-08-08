import medusaRequest from "@lib/medusa-fetch"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams)
  const { handle, page, limit, cart_id } = searchParams

  const collection = await fetchCollection(handle)
    .then((res) => res)
    .catch((error) => {
      throw new Error(JSON.stringify(error.error))
    })

  const { products, count, nextPage } = await fetchCollectionProducts({
    page,
    id: collection.id,
    limit,
    cart_id,
  }).then((res) => res)

  return NextResponse.json({
    collection,
    response: {
      products,
      count,
    },
    nextPage,
  })
}

async function fetchCollection(handle: string) {
  return await medusaRequest("GET", "/collections", {
    query: { handle: [handle] },
  }).then(({ body }) => ({
    id: body.collections[0].id,
    handle: body.collections[0].handle,
    title: body.collections[0].title,
  }))
}

async function fetchCollectionProducts({
  page = "0",
  id,
  limit = "12",
  cart_id,
}: {
  page: string
  id: string
  limit: string
  cart_id: string
}) {
  const { products, count, offset } = await medusaRequest("GET", "/products", {
    query: {
      collection_id: [id],
      cart_id,
      limit,
      offset: page,
      expand: "variants,variants.prices",
    },
  }).then((res) => res.body)

  const nextPage = parseInt(offset) + parseInt(limit)

  return {
    products,
    count,
    nextPage: count > nextPage ? nextPage : null,
  }
}
