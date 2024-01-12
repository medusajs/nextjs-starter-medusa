import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getProductByHandle, getProductsList } from "@lib/data"
import ProductTemplate from "@modules/products/templates"

type Props = {
  params: { handle: string }
}

export async function generateStaticParams() {
  const {
    response: { products },
  } = await getProductsList({})

  return products.map((product) => ({
    handle: product.handle,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = params

  const { product } = await getProductByHandle(handle).then(
    (product) => product
  )

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Medusa Store`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Medusa Store`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { product } = await getProductByHandle(params.handle).catch((err) => {
    notFound()
  })

  return <ProductTemplate product={product} />
}
