import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import About from "@modules/home/components/about"
import { listCollections } from "@lib/data/collections"
import { retrievePageBySlug } from "@lib/data/pages"
import { getRegion } from "@lib/data/regions"
import { retrieveStore } from "@lib/data/store"

export async function generateMetadata(): Promise<Metadata> {
  const store = await retrieveStore()
  const storeName = store?.name || "Luxe Linen"

  return {
    title: storeName,
    description: "Soft essentials for everyday living.",
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })
  const store = await retrieveStore()
  const storeName = store?.name || "Luxe Linen"
  const homePage = await retrievePageBySlug("home")

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero page={homePage} />
      <About content={homePage?.content} />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
