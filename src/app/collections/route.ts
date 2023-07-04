import medusaRequest from "@lib/medusa-fetch"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const handle = searchParams.get("handle") ?? ""
  const pageParam = searchParams.get("pageParam") ?? "0"

  const collection = await fetchCollection(handle)
    .then((res) => res)
    .catch((error) => {
      throw new Error(JSON.stringify(error.error))
    })

  const { response, nextPage } = await fetchCollectionProducts({
    pageParam,
    id: collection.id,
  }).then((res) => res)

  return NextResponse.json({
    collection,
    products: response.products,
    count: response.count,
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
  pageParam = "0",
  id,
}: {
  pageParam?: string
  id: string
}) {
  const { products, count, offset } = await medusaRequest(
    "GET",
    `/products?collection_id[]=${id}`,
    {
      limit: "12",
      offset: pageParam,
    }
  ).then((res) => res.body)

  return {
    response: { products, count },
    nextPage: count > offset + 12 ? offset + 12 : null,
  }
}
