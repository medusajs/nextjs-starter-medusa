import { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  getCustomer,
  getProductByHandle,
  getProductsList,
  getRegion,
  listAuctions,
  listRegions,
  retrievePricedProductById,
} from "@lib/data"
import { Region } from "@medusajs/medusa"
import AuctionsActions from "@modules/products/components/auction-actions"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { Suspense } from "react"

type Props = {
  params: { countryCode: string; handle: string }
}

export async function generateStaticParams() {
  const countryCodes = await listRegions().then((regions) =>
    regions?.map((r) => r.countries.map((c) => c.iso_2)).flat()
  )

  if (!countryCodes) {
    return null
  }

  const products = await Promise.all(
    countryCodes.map((countryCode) => {
      return getProductsList({ countryCode })
    })
  ).then((responses) =>
    responses.map(({ response }) => response.products).flat()
  )

  const staticParams = countryCodes
    ?.map((countryCode) =>
      products.map((product) => ({
        countryCode,
        handle: product.handle,
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = params

  const { product } = await getProductByHandle(handle).then(
    (product) => product
  )

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Medusa Store`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Medusa Store`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

const getPricedProductByHandle = async (handle: string, region: Region) => {
  const { product } = await getProductByHandle(handle).then(
    (product) => product
  )

  if (!product || !product.id) {
    return null
  }

  const pricedProduct = await retrievePricedProductById({
    id: product.id,
    regionId: region.id,
  })

  return pricedProduct
}

export default async function ProductPage({ params }: Props) {
  const { product } = await getProductByHandle(params.handle).then(
    (product) => product
  )

  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const pricedProduct = await getPricedProductByHandle(params.handle, region)

  if (!pricedProduct || !pricedProduct.id) {
    notFound()
  }

  const customer = await getCustomer()

  const {
    auctions: { [0]: auction },
  } = await listAuctions(pricedProduct.id)

  return (
    <>
      <div className="content-container flex flex-col small:flex-row small:items-start py-6 relative">
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-6">
          <ProductInfo product={product} />
          <ProductTabs product={product} />
        </div>
        <div className="block w-full relative">
          <ImageGallery images={product?.images || []} />
        </div>
        <AuctionsActions
          product={product}
          region={region}
          auction={auction}
          customer={customer}
        />
      </div>
      <div className="content-container my-16 small:my-32">
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={params.countryCode} />
        </Suspense>
      </div>
    </>
  )
}
