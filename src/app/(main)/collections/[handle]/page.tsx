import CollectionTemplate from "@modules/collections/templates"
import { Metadata } from "next"

type Props = {
  params: { handle: string }
}

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:8000"

async function getCollection(handle: string) {
  const res = await fetch(`${BASEURL}/collections?handle=${handle}`)

  if (!res.ok) {
    throw new Error(`Failed to fetch collection: ${handle}`)
  }

  return res.json()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection } = await getCollection(params.handle)

  return {
    title: `${collection.title} | Acme Store`,
    description: `${collection.title} collection`,
  }
}

export default async function CollectionPage({ params }: Props) {
  const { collection } = await getCollection(params.handle)

  return <CollectionTemplate collection={collection} />
}
