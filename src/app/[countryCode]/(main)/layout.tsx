import { Metadata } from "next"

import { retrieveCart } from "@lib/data/cart"
import { getCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await getCustomer()
  const cart = await retrieveCart()

  return (
    <>
      <Nav />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}
      {props.children}
      <Footer />
    </>
  )
}
