import { Metadata } from "next"

import CheckoutTemplate from "@modules/checkout/templates"
import { cookies } from "next/headers"
import { enrichLineItems, retrieveCart } from "@modules/cart/actions"
import { LineItem } from "@medusajs/medusa"
import Wrapper from "@modules/checkout/components/payment-wrapper"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

const fetchCart = async () => {
  const cart = await retrieveCart()

  if (cart?.items.length) {
    const enrichedItems = await enrichLineItems(cart?.items, cart?.region_id)
    cart.items = enrichedItems as LineItem[]
  }

  return cart
}

export default async function Checkout() {
  const cartId = cookies().get("cartId")?.value

  if (!cartId) {
    return notFound()
  }

  const cart = await fetchCart()

  if (!cart) {
    return notFound()
  }

  return (
    <Wrapper cart={cart}>
      <CheckoutTemplate />
    </Wrapper>
  )
}
