import Link from "next/link"
import { getTranslations } from "next-intl/server"

import { listProducts } from "@/utils/data/products"

import { ProductPreview } from "@/components/modules/product/product-preview"
import { Button } from "@/components/ui/primitives/button"

import type { HttpTypes } from "@medusajs/types"
import { ChevronRightIcon } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/primitives/carousel"
import { listCollections } from "@/utils/data/collections"
import { Avatar, AvatarFallback } from "@/components/ui/primitives/avatar"
import { Container } from "@/components/ui/react/design-system"
import Image from "next/image"

async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const t = await getTranslations("pages.home.product_rail")

  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      // @ts-ignore - collection_id is a required parameter
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <Container className="my-10">
      <div className="flex justify-between mb-5">
        <h1 className="text-xl font-medium">{collection.title}</h1>
        <Link href={`/collections/${collection.handle}`}>
          <Button variant="ghost">
            {t("view_all_button", { defaultMessage: "View all" })}{" "}
            <ChevronRightIcon />
          </Button>
        </Link>
      </div>
      <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
      </ul>
    </Container>
  )
}

async function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  return collections.map((collection) => (
    <li key={collection.id}>
      <ProductRail collection={collection} region={region} />
    </li>
  ))
}

async function Hero() {
  const { collections } = await listCollections({
    fields: "*products",
  })

  return (
    <div className="flex items-center w-full gap-10 flex-col mt-10">
      <Container>
        <Carousel>
          <CarouselContent shape="rounded">
            {[
              "/assets/images/example-slider-image.webp",
              "/assets/images/example-slider-image.webp",
              "/assets/images/example-slider-image.webp",
            ].map((imageUrl, idx) => (
              <CarouselItem
                key={imageUrl + idx}
                className="first:rounded-l-xl overflow-hidden last:rounded-r-xl"
              >
                <Image
                  src={imageUrl}
                  alt={imageUrl}
                  width={1980}
                  height={1080}
                  className="w-full h-76 lg:h-96 object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Container>
      <Container>
        <Carousel>
          <CarouselContent>
            {collections.map((collection) => (
              <CarouselItem
                className="basis-22.5 group/card"
                key={collection.id}
              >
                <Link href={`/collections/${collection.handle}`}>
                  <div className="flex flex-col items-center w-full">
                    <Avatar className="size-18 border group-hover/card:border-foreground transition-colors font-bold">
                      <AvatarFallback>
                        {collection.title.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-center text-sm mt-1">
                      {" "}
                      {collection.title}
                    </p>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Container>
    </div>
  )
}

export { Hero, FeaturedProducts }
