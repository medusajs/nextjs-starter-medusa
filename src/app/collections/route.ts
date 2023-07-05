import medusaRequest from "@lib/medusa-fetch"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const handle = searchParams.get("handle") ?? ""
  const pageParam = searchParams.get("pageParam") ?? "0"
  const limit = searchParams.get("limit") ?? "12"
  const cart_id = searchParams.get("cart_id") ?? ""

  const collection = await fetchCollection(handle)
    .then((res) => res)
    .catch((error) => {
      throw new Error(JSON.stringify(error.error))
    })

  const { products, count, nextPage } = await fetchCollectionProducts({
    pageParam,
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
  return await medusaRequest("GET", `/collections?handle[]=${handle}`).then(
    ({ body }) => ({
      id: body.collections[0].id,
      handle: body.collections[0].handle,
      title: body.collections[0].title,
    })
  )
}

async function fetchCollectionProducts({
  pageParam,
  id,
  limit,
  cart_id,
}: {
  pageParam: string
  id: string
  limit: string
  cart_id: string
}) {
  const { products, count, offset } = await medusaRequest(
    "GET",
    `/products?collection_id[]=${id}`,
    {
      cart_id,
      limit,
      offset: pageParam,
      expand: "variants,variants.prices",
    }
  ).then((res) => res.body)

  return {
    products,
    count,
    nextPage:
      count > parseInt(offset) + parseInt(limit)
        ? parseInt(offset) + parseInt(limit)
        : null,
  }
}
