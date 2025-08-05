import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { HttpTypes } from "@medusajs/types"

interface OriginalHomepageProps {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
  countryCode: string
}

export default function OriginalHomepage({ 
  collections, 
  region, 
  countryCode 
}: OriginalHomepageProps) {
  return (
    <>
      <Hero />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}