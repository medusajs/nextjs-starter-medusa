import { getCollectionByHandle } from "@lib/data"
import CollectionTemplate from "@modules/collections/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: { handle: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collections } = await getCollectionByHandle(params.handle)

  const collection = collections[0]

  if (!collection) {
    notFound()
  }

  return {
    title: `${collection.title} | Medusa Store`,
    description: `${collection.title} collection`,
  }
}

export default async function CollectionPage({ params }: Props) {
  const { collections } = await getCollectionByHandle(params.handle)

  const collection = collections[0]

  return <CollectionTemplate collection={collection} />
}
