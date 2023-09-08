import { getCategoryByHandle } from "@lib/data"
import CategoryTemplate from "@modules/categories/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: { handle: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product_categories } = await getCategoryByHandle(params.handle)

  const category = product_categories[0]

  if (!category) {
    notFound()
  }

  return {
    title: `${category.title} | Acme Store`,
    description: `${category.title} collection`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { product_categories } = await getCategoryByHandle(params.handle)

  const category = product_categories[0]

  return <CategoryTemplate category={category} />
}
