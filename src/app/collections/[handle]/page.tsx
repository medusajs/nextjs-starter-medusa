import Collection from "./collection"

import { Metadata } from "next"

type Props = {
  params: { handle: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://localhost:3000"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection } = await fetch(
    `${BASEURL}/collections?handle=${params.handle}`
  ).then((res) => res.json())

  return {
    title: `${collection.title} | Acme Store`,
    description: `${collection.title} collection`,
  }
}

export default async function CollectionPage({ params }: Props) {
  const { collection } = await fetch(
    `${BASEURL}/collections?handle=${params.handle}`
  ).then((res) => res.json())

  return (
    <>
      <Collection collection={collection} />
    </>
  )
}
