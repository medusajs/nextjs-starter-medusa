import medusaRequest from "@lib/medusa-fetch"
import ProductTemplate from "@modules/products/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: { handle: string }
}

async function getProducts(handle: string) {
  const res = await medusaRequest("GET", "/products", {
    query: {
      handle,
    },
  })

  if (!res.ok) {
    notFound()
  }

  return res.body
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { products } = await getProducts(params.handle)

  if (!products.length) {
    notFound()
  }

  const product = products[0]

  return {
    title: `${product.title} | Acme Store`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Acme Store`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function CollectionPage({ params }: Props) {
  const { products } = await getProducts(params.handle)

  return <ProductTemplate product={products[0]} />
}
