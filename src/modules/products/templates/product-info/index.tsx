import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Suspense } from "react"

import ProductPriceRow from "./product-price-row"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="mx-auto flex w-full max-w-none flex-col gap-y-2 small:mx-0 lg:max-w-[500px]">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-x-2 font-sans text-[10px] uppercase tracking-[0.14em] text-qw-medium-grey"
        >
          <LocalizedClientLink
            href="/store"
            className="hover:text-qw-charcoal"
          >
            Store
          </LocalizedClientLink>
          {product.collection?.handle ? (
            <>
              <span aria-hidden="true">/</span>
              <LocalizedClientLink
                href={`/collections/${product.collection.handle}`}
                className="hover:text-qw-charcoal"
              >
                {product.collection.title}
              </LocalizedClientLink>
            </>
          ) : null}
          <span aria-hidden="true">/</span>
          <span className="text-qw-charcoal">{product.title}</span>
        </nav>

        <Heading
          level="h1"
          className="font-sans font-light text-[clamp(1.5rem,2.2vw,1.9rem)] leading-[1.08] tracking-[0.165px] text-qw-black uppercase"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        <Suspense
          fallback={
            <div className="box-border flex w-full flex-col items-start justify-center pr-2.5 pt-0.5">
              <div className="h-5 w-32 animate-pulse bg-qw-pale-grey" />
            </div>
          }
        >
          <ProductPriceRow product={product} />
        </Suspense>

        {product.description ? (
          <Text
            className="normal-case mt-5 whitespace-pre-line font-sans text-[13px] leading-[1.66rem] text-qw-charcoal [&_a]:text-[13px] [&_a]:font-normal [&_a]:uppercase [&_a]:leading-[1.66rem] [&_a]:tracking-[0.025em] [&_a]:text-qw-black [&_a]:no-underline [&_a]:hover:text-qw-black [&_b]:text-[13px] [&_b]:font-normal [&_b]:uppercase [&_b]:leading-[1.66rem] [&_b]:tracking-[0.025em] [&_b]:text-qw-black"
            data-testid="product-description"
          >
            {product.description}
          </Text>
        ) : null}
      </div>
    </div>
  )
}

export default ProductInfo
