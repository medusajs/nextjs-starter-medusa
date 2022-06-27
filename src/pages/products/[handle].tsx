import { medusaClient } from "@lib/config"
import { getProductData } from "@lib/data"
import { getProductHandles } from "@lib/util/get-product-handles"
import { Product } from "@medusajs/medusa"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import ProductTemplate from "@modules/products/templates"
import { useCart } from "medusa-react"
import { GetStaticPaths, GetStaticProps } from "next"
import { ParsedUrlQuery } from "querystring"
import { ReactElement, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { NextPageWithLayout, StoreProps } from "types/global"

interface Params extends ParsedUrlQuery {
  handle: string
}

// At runtime we refetch the product data to get the latest inventory data,
// as well as the price data related to the current cart.
const fetchRehydrate = async ({
  productId,
  cartId,
}: {
  productId: string
  cartId: string
}) => {
  const request = await medusaClient.products.list({
    id: productId,
    cart_id: cartId,
  })

  return request.products[0].variants
}

const ProductPage: NextPageWithLayout<StoreProps<Product, Product[]>> = ({
  page,
  site,
}) => {
  const { data } = page
  const { cart } = useCart()

  const [product, setProduct] = useState(data)

  const { data: rehydratedVariants } = useQuery(
    [`rehydrated_variants_${product.id}`, product.id, cart?.id],
    async () =>
      await fetchRehydrate({ productId: product.id, cartId: cart?.id! }),
    {
      enabled: !!cart,
    }
  )

  // rehydrate product after inventory is fetched
  useEffect(() => {
    if (data && rehydratedVariants) {
      // @ts-ignore - ignore ts as product variant type is erroneously typed
      setProduct({
        ...data,
        variants: rehydratedVariants,
      })
    }
  }, [data, rehydratedVariants])

  return (
    <>
      <Head
        description={product.description}
        title={product.title}
        image={product.thumbnail}
      />
      <ProductTemplate product={product} />
    </>
  )
}

ProductPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const handles = await getProductHandles()
  return {
    paths: handles.map((handle) => ({ params: { handle } })),
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<
  StoreProps<Product, Product[]>,
  Params
> = async (context) => {
  const handle = context.params?.handle

  if (!handle) {
    throw new Error("No handle provided")
  }

  const data = await getProductData(handle)

  return {
    props: {
      ...data,
    },
  }
}

export default ProductPage
