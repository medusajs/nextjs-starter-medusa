import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@/utils/data/cart"
import { retrieveCustomer } from "@/utils/data/customer"
import { getBaseURL } from "@/utils/helpers/env"

import { CartMismatchAlert } from "@/components/layout/cart/cart-mismatch-alert"
import { ShippingPriceNudge } from "@/components/layout/free-shipping-price-nudge"

import { CartSidebar } from "@/components/layout/cart/cart-sidebar"
import { Navbar } from "@/components/common/navbar"
import { Footer } from "@/components/common/footer"

import type { StoreCartShippingOption } from "@medusajs/types"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

type Props = {
  children: React.ReactNode
}

export default async function PageLayout(props: Props) {
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()

  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()

    shippingOptions = shipping_options
  }

  return (
    <div className="flex items-start">
      <div className="flex flex-col items-center w-full">
        <Navbar />
        {cart && (
          <ShippingPriceNudge
            variant="popup"
            cart={cart}
            shippingOptions={shippingOptions}
          />
        )}
        {customer && cart && (
          <CartMismatchAlert customer={customer} cart={cart} />
        )}
        {props.children}
        <Footer />
      </div>
      <CartSidebar cart={cart} />
    </div>
  )
}
