"use client"
import { getProductHandles } from "@lib/util/get-product-handles"
import ProductTemplate from "@modules/products/templates"

interface PageProps {
  params: { handle: string }
}

export default async function ProductPage({ params }: PageProps) {
  const handle = params.handle ?? ""

  const data = await fetch(
    `http://localhost:3000/store/products?handle=${handle}&limit=1`,
    { cache: "force-cache" }
  ).then((res) => res.json()) // TODO throw if length === 0

  return <ProductTemplate product={data} />
}

// export async function generateMetadata(
//   { params, searchParams }: any,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   // read route params
//   const id = params.id
//
//   // TODO
//   const product = await fetch(`http://localhost/${id}`).then((res) =>
//     res.json()
//   )
//
//   return {
//     title: product.title,
//     description: product.description,
//     openGraph: {
//       images: [product.thumbnail],
//     },
//   }
// }

export async function generateStaticParams() {
  const handles = await getProductHandles()

  return handles.map((handle) => ({
    handle,
  }))
}
