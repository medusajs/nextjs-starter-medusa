import ProductTemplate from "@modules/products/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: { handle: string }
}

async function getProducts(handle: string) {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${handle}`
  )
    .then((res) => res.json())
    .catch(() => {
      notFound()
    })

  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await getProducts(params.handle)

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
  const { product } = await getProducts(params.handle)

  return <ProductTemplate product={product} />
}
