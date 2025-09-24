import { Suspense } from "react"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@/utils/data/categories"
import { listRegions } from "@/utils/data/regions"
import { generateMeta } from "@/utils/meta/generate-meta"

import { SkeletonProductGrid } from "@/components/modules/skeleton/product-grid"
import { Button } from "@/components/ui/primitives/button"
import { LocalizedClientLink } from "@/components/i18n/client-link"
import { PaginatedProductGrid } from "@/components/modules/product/paginated-product-grid"
import { Container } from "@/components/ui/react/design-system"

import type { HttpTypes, StoreRegion } from "@medusajs/types"
import {
  RefinementList,
  type SortOptions,
} from "@/components/modules/store/refinement-list"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    page?: string
    sortBy?: SortOptions
  }>
}

export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }

  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
  )

  const categoryHandles = product_categories.map(
    (category: any) => category.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string | undefined) =>
      categoryHandles.map((handle: any) => ({
        countryCode,
        category: [handle],
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, countryCode } = await params
  try {
    const productCategory = await getCategoryByHandle(category)

    return generateMeta({
      meta: {
        title: productCategory.name,
        description: productCategory.description || productCategory.name,
      },
      slug: [countryCode, "categories", ...category],
    })
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category, countryCode } = await params
  const { page, sortBy = "created_at" } = await searchParams

  const pageNumber = page ? parseInt(page) : 1

  const productCategory = await getCategoryByHandle(category)

  if (!productCategory) {
    notFound()
  }

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(productCategory)

  return (
    <Container className="flex flex-col lg:flex-row items-start lg:gap-10">
      <div className="bg-secondary p-6 rounded-xl lg:sticky lg:max-w-66 w-full mt-5 lg:mt-0 lg:top-26">
        <h1 className="text-xl">{productCategory.name}</h1>
        <p>{productCategory.description}</p>
        <RefinementList className="mt-4" sortBy={sortBy} />
        {parents &&
          parents.map((parent) => (
            <span key={parent.id} className="text-foreground">
              <LocalizedClientLink
                className="mr-4 hover:text-black"
                href={`/categories/${parent.handle}`}
                data-testid="sort-by-link"
              >
                {parent.name}
              </LocalizedClientLink>
              /
            </span>
          ))}
        {productCategory.category_children.length > 0 && (
          <div className="mb-2 text-base-large">
            <ul className="grid grid-cols-1 gap-2">
              {productCategory.category_children?.map((c) => (
                <li key={c.id}>
                  <Link href={`/categories/${c.handle}`}>
                    <Button variant="link" size="clear">
                      {c.name}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="my-5 lg:my-10">
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={productCategory.products?.length ?? 8}
            />
          }
        >
          <PaginatedProductGrid
            sortBy={sortBy}
            page={pageNumber}
            categoryId={productCategory.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </Container>
  )
}
