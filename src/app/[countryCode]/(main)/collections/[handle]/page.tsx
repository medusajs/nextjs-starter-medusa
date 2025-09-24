import { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"

import {
  getCollectionByHandle,
  listCollections,
} from "@/utils/data/collections"
import { listRegions } from "@/utils/data/regions"
import { generateMeta } from "@/utils/meta/generate-meta"

import { Container } from "@/components/ui/react/design-system"
import { PaginatedProductGrid } from "@/components/modules/product/paginated-product-grid"
import { SkeletonProductGrid } from "@/components/modules/skeleton/product-grid"
import { RefinementList } from "@/components/modules/store/refinement-list"

import type { StoreCollection, StoreRegion } from "@medusajs/types"
import type { SortOptions } from "@/components/modules/store/refinement-list"

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<{
    page?: string
    sortBy?: SortOptions
  }>
}

export async function generateStaticParams() {
  const { collections } = await listCollections({
    fields: "*products",
  })

  if (!collections) {
    return []
  }

  const countryCodes = await listRegions().then(
    (regions: StoreRegion[]) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  )

  const collectionHandles = collections.map(
    (collection: StoreCollection) => collection.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string) =>
      collectionHandles.map((handle: string | undefined) => ({
        countryCode,
        handle,
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  return generateMeta({
    meta: {
      title: collection.title,
      description: `${collection.title} collection`,
    },
    slug: [params.countryCode, "collections", params.handle],
  })
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle, countryCode } = await params
  const { page, sortBy = "created_at" } = await searchParams

  const pageNumber = page ? parseInt(page) : 1

  const collection = await getCollectionByHandle(handle).then(
    (collection: StoreCollection) => collection
  )

  if (!collection) {
    notFound()
  }

  return (
    <Container className="flex flex-col lg:flex-row items-start lg:gap-10">
      <div className="bg-secondary p-6 rounded-xl lg:sticky lg:max-w-66 w-full mt-5 lg:mt-0 lg:top-26">
        <h1 className="text-xl mb-4">{collection.title}</h1>
        <RefinementList sortBy={sortBy} />
      </div>
      <div className="my-5 lg:my-10">
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={collection.products?.length}
            />
          }
        >
          <PaginatedProductGrid
            page={pageNumber}
            collectionId={collection.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </Container>
  )
}
