import { Fragment } from "react"
import { getTranslations } from "next-intl/server"

import { listCollections } from "@/utils/data/collections"
import { getRegion } from "@/utils/data/regions"
import { generateMeta } from "@/utils/meta/generate-meta"

import { Hero, FeaturedProducts } from "@/components/features/main/homepage"

export async function generateMetadata() {
  const t = await getTranslations("pages.home.meta")
  return generateMeta({
    meta: {
      title: t("title"),
      description: t("description"),
    },
  })
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

  return (
    <Fragment>
      <Hero />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </Fragment>
  )
}
