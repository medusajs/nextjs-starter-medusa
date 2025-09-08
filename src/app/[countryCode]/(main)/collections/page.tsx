import { Metadata } from "next"

import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Koleksiyonlar | Kedişli Sevimli Çanta Atölyesi",
  description: "El yapımı sevimli çanta koleksiyonlarımızı keşfedin.",
}

export default async function CollectionsPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const { collections } = await listCollections({
    fields: "id, handle, title, description",
  })

  if (!collections) {
    return null
  }

  // Filter out collections without handles
  const validCollections = collections.filter(collection => collection.handle)

  return (
    <div className="content-container py-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-ui-fg-base mb-4">
          Koleksiyonlarımız
        </h1>
        <p className="text-lg text-ui-fg-subtle">
          El yapımı sevimli çanta koleksiyonlarımızı keşfedin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {validCollections.map((collection) => (
          <div
            key={collection.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
          >
            <h2 className="text-xl font-semibold text-ui-fg-base mb-3">
              {collection.title}
            </h2>
            {collection.description && (
              <p className="text-ui-fg-subtle mb-4 line-clamp-3">
                {collection.description}
              </p>
            )}
            <LocalizedClientLink
              href={`/collections/${collection.handle}`}
              className="inline-block bg-ui-bg-interactive text-ui-fg-on-inverted px-4 py-2 rounded-md hover:bg-ui-bg-interactive-hover transition-colors duration-200"
            >
              Koleksiyonu Gör
            </LocalizedClientLink>
          </div>
        ))}
      </div>
    </div>
  )
}

