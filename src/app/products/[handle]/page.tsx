import medusaRequest from "@lib/medusa-fetch"
import ProductTemplate from "@modules/products/templates"
import { Metadata } from "next"

type Props = {
  params: { handle: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { products } = await medusaRequest("GET", "/products", {
    query: {
      handle: params.handle,
      //   expand: "variants,variants.prices,thumbnail",
    },
  }).then((res) => res.body)

  const product = products[0]

  return {
    title: `${products.title} | Acme Store`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Acme Store`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function CollectionPage({ params }: Props) {
  const { products } = await medusaRequest("GET", "/products", {
    query: {
      handle: params.handle,
      //   expand: "variants,variants.prices",
    },
  }).then((res) => res.body)

  return <ProductTemplate product={products[0]} />
}
