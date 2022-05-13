import { getSiteData } from "@lib/data"
import Head from "@modules/common/components/head"
import Hero from "@modules/common/components/hero"
import Layout from "@modules/layout/templates"
import type { GetStaticProps, NextPage } from "next"
import { SiteProps } from "types/global"

const Home: NextPage<SiteProps> = ({ site }) => {
  return (
    <Layout site={site}>
      <Head
        title="Store"
        description="Shop all available models only at the ACME. Worldwide Shipping. Secure Payment."
      />
      <div className="lg:mb-32 mb-16">
        <Hero
          image={{
            src: "/hero-image.png",
            alt: "Credit to @forcemajeure for the image",
          }}
          copy={{
            headline: "Summer is here",
            subline: "New collection",
            text: "Get your summer look on. Shop the latest collection from ACME.",
          }}
          callToAction={{
            text: "Shop now",
            link: "/shop",
          }}
        />
      </div>
    </Layout>
  )
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
