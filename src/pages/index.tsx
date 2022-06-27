import { getSiteData } from "@lib/data"
import Head from "@modules/common/components/head"
import Layout from "@modules/layout/templates"
import ProductDisplay from "@modules/products/components/product-display"
import { useProducts } from "medusa-react"
import type { GetStaticProps } from "next"
import { ReactElement } from "react"
import { NextPageWithLayout, SiteProps } from "types/global"

const Home: NextPageWithLayout = () => {
  const { products } = useProducts({
    is_giftcard: false,
  })
  return (
    <>
      <Head
        title="Store"
        description="Shop all available models only at the ACME. Worldwide Shipping. Secure Payment."
      />
      {products && <ProductDisplay products={products} />}
    </>
  )
}

Home.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>
}

export const getStaticProps: GetStaticProps<SiteProps> = async () => {
  const data = await getSiteData()

  return {
    props: {
      ...data,
    },
  }
}

export default Home
