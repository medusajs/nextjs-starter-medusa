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
        image="https://cdn.shopify.com/s/files/1/0585/7820/6912/files/desktop1_2048x.jpg?v=1649972368"
      />
      <div className="lg:mb-32 mb-16">
        <Hero
          image={{
            src: "/hero-image.png",
            alt: "Credit to @forcemajeure for the image",
          }}
          copy={{
            headline: "Next.JS + Medusa",
            subline: "New starter",
            text: "Get up and running with Next.JS and Medusa in no time.",
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
