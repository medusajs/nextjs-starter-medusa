import { LocalizedClientLink } from "@/components/i18n/client-link"

import type { HttpTypes } from "@medusajs/types"

type Props = {
  product: HttpTypes.StoreProduct
}

function ProductInfo({ product }: Props) {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-muted-foreground hover:text-primary font-serif text-2xl font-bold hover:underline underline-offset-4 transition-colors"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <h2
          className="text-3xl font-medium leading-10 text-foreground"
          data-testid="product-title"
        >
          {product.title}
        </h2>

        <p
          className="text-sm text-muted-foreground whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </p>
      </div>
    </div>
  )
}

export { ProductInfo }
export type { Props as ProductInfoProps }
