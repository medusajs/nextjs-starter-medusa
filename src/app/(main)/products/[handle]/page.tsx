import { getProductByHandle } from "@lib/medusa-fetch/products"
import ProductTemplate from "@modules/products/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: { handle: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { products } = await getProductByHandle(params.handle).catch((err) => {
    console.error(err)
    notFound()
  })

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
  const { products } = await getProductByHandle(params.handle).catch((err) => {
    console.error(err)
    notFound()
  })

  console.log(products)

  return <ProductTemplate product={products[0]} />
}
