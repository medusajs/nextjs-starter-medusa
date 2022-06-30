import Layout from "@modules/layout/templates"
import ProductPreview from "@modules/products/components/product-preview"
import { useProducts } from "medusa-react"
import { NextPageWithLayout } from "types/global"

const Store: NextPageWithLayout = () => {
  const { products } = useProducts()
  return (
    <div className="content-container">
      <div className="grid grid-cols-4 gap-x-4 gap-y-8">
        {products?.map((product) => (
          <ProductPreview key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

Store.getLayout = (page) => <Layout>{page}</Layout>

export default Store
