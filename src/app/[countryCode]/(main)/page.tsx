import { Metadata } from "next"

import FeaturedProductsSlider from "@modules/home/components/featured-products-slider"
import FeaturedProductsShowcase from "@modules/home/components/featured-products-showcase"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Kedişli Sevimli Çanta Atölyesi",
  description:
    "Discover amazing products at great prices. Shop the latest trends and find everything you need.",
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

  if (!collections || !region) {
    return null
  }

  // Filter out collections without handles
  const validCollections = collections.filter(collection => collection.handle)

  return (
    <>
      <Hero />
      
      {/* Featured Products Showcase */}
      <div className="py-8">
        <FeaturedProductsShowcase region={region} />
      </div>
      
      {/* Collections Slider */}
      {validCollections.length > 0 && (
        <div className="py-8">
          <FeaturedProductsSlider collections={validCollections} region={region} />
        </div>
      )}
    </>
  )
}
