import { medusaClient } from "@lib/config"
import Head from "@modules/common/components/head"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import Layout from "@modules/layout/templates"
import type { GetStaticProps } from "next"
import { ReactElement } from "react"
import { NextPageWithLayout } from "types/global"

export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string
}

type HomeProps = {
  products: FeaturedProduct[] | null
}

const Home: NextPageWithLayout<HomeProps> = ({ products }) => {
  return (
    <>
      <Head
        title="Store"
        description="Shop all available models only at the ACME. Worldwide Shipping. Secure Payment."
      />
      <Hero />
      {products && <FeaturedProducts products={products} />}
    </>
  )
}

Home.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const products = await medusaClient.products
    .list({ limit: 4, is_giftcard: false })
    .then(({ products }) => products)
    .catch(() => null)

  const toReturn: FeaturedProduct[] | null =
    products?.map((product) => ({
      id: product.id,
      title: product.title,
      handle: product.handle,
      thumbnail: product.thumbnail || product.images?.[0]?.url || "",
    })) || null

  return {
    props: {
      products: toReturn,
    },
  }
}

export default Home
