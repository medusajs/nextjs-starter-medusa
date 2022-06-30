import UnderlineLink from "@modules/common/components/underline-link"
import ProductPreview from "@modules/products/components/product-preview"
import { FeaturedProduct } from "@pages/index"

type FeaturedProductsProps = {
  products: FeaturedProduct[]
}

const FeaturedProducts = ({ products }: FeaturedProductsProps) => {
  return (
    <div className="py-12">
      <div className="content-container py-12">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-base-regular text-gray-600 mb-6">
            Latest products
          </span>
          <p className="text-2xl-regular text-gray-900 max-w-lg mb-4">
            Our newest styles are here to help you look your best.
          </p>
          <UnderlineLink href="/store">Explore products</UnderlineLink>
        </div>
        <div className="grid grid-cols-2 small:grid-cols-4 gap-x-4 gap-y-8">
          {products.map((product) => (
            <ProductPreview key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeaturedProducts
