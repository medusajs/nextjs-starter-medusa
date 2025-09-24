import { Fragment } from "react"
import Image from "next/image"
import { getTranslations } from "next-intl/server"

import { cn } from "@/lib/utils"
import { getProductPrice } from "@/utils/helpers/math"

import { LocalizedClientLink } from "@/components/i18n/client-link"
import { Button } from "@/components/ui/primitives/button"

import type { HttpTypes } from "@medusajs/types"
import type { VariantPrice } from "@/types/global"

async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <Fragment>
      {price.price_type === "sale" && (
        <p
          className="line-through text-muted-foreground !text-lg"
          data-testid="original-price"
        >
          {price.original_price}
        </p>
      )}
      <p
        className={cn("text-muted-foreground text-lg", {
          "text-primary !text-sm": price.price_type === "sale",
        })}
        data-testid="price"
      >
        {price.calculated_price}
      </p>
    </Fragment>
  )
}

async function ProductPreview({
  product,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const t = await getTranslations("modules.product.preview")

  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`}>
      <div className="border rounded-xl overflow-hidden">
        <Image
          src={product.thumbnail || ""}
          alt={product.title}
          width={500}
          height={500}
          className="object-cover rounded-xl object-center aspect-square"
        />

        <div className="w-full flex flex-col p-3 items-start">
          <p
            className="text-foreground text-lg leading-snug line-clamp-1"
            data-testid="product-title"
          >
            {product.title}
          </p>
          <div className="flex items-center gap-x-2">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
          <Button size="lg" className="w-full mt-2">
            {t("detail_button")}
          </Button>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

export { ProductPreview, PreviewPrice }
