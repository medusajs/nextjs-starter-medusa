import { getCategoryByHandle } from "@lib/data"
import CategoryTemplate from "@modules/categories/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: {
    category: string
    subcategory: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product_categories } = await getCategoryByHandle(
    `${params.category}/${params.subcategory}`
  ).catch((err) => {
    notFound()
  })

  const category = product_categories[0]

  return {
    title: `${category.name} | Acme Store`,
    description: `${category.name} category`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { product_categories, parent } = await getCategoryByHandle(
    `${params.category}/${params.subcategory}`
  ).catch((err) => {
    notFound()
  })

  const category = product_categories[0]

  return <CategoryTemplate category={category} parent={parent} />
}
