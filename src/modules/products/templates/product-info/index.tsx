import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getProductPrice } from "@lib/util/get-product-price"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const { cheapestPrice } = getProductPrice({ product })

  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-x-2 text-[12px] leading-4 uppercase tracking-wider font-sans text-qw-medium-grey"
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

        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="font-serif font-light text-qw-charcoal uppercase tracking-[0.12em] text-[14px] leading-5 hover:text-qw-charcoal"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="font-serif font-light text-[clamp(2rem,4vw,2.8rem)] leading-tight text-qw-black tracking-[0.12em] uppercase"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        <Text
          className="font-sans text-[14px] leading-relaxed text-qw-medium-grey whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </Text>

        {cheapestPrice?.calculated_price ? (
          <div className="flex items-center gap-x-3 pt-2">
            <span className="font-sans uppercase tracking-[0.2em] text-qw-medium-grey text-[12px] leading-4">
              From
            </span>
            <span className="font-serif font-light text-qw-black text-[20px] leading-7">
              {cheapestPrice.calculated_price}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ProductInfo
