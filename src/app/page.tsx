import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import Providers from "@modules/providers"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home",
  description:
    "Shop all available models only at the ACME. Worldwide Shipping. Secure Payment.",
}

const Home = () => {
  return (
    <Providers>
      <Nav />
      <Hero />
      <FeaturedProducts />
      <Footer />
    </Providers>
  )
}

export default Home
