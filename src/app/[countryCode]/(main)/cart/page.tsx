import { LineItem } from "@medusajs/medusa"
import { Metadata } from "next"
import { cookies } from "next/headers"

import { getI18n } from "../../../../locales/server"

import CartTemplate from "@modules/cart/templates"

import { enrichLineItems } from "@modules/cart/actions"
import { getCheckoutStep } from "@lib/util/get-checkout-step"
import { CartWithCheckoutStep } from "types/global"
import { getCart, getCustomer } from "@lib/data"

export const metadata: Metadata = {
  title: "cart.title",
  description: "cart.desc",
}

const fetchCart = async () => {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) {
    return null
  }

  const cart = await getCart(cartId).then(
    (cart) => cart as CartWithCheckoutStep
  )

  if (!cart) {
    return null
  }

  if (cart?.items.length) {
    const enrichedItems = await enrichLineItems(cart?.items, cart?.region_id)
    cart.items = enrichedItems as LineItem[]
  }

  cart.checkout_step = (cart && getCheckoutStep(cart) || "address")

  return cart
}

export default async function Cart() {
  const t = await getI18n()
  metadata.title = t("cart.title")
  metadata.description = t("cart.desc")

  const cart = await fetchCart()
  const customer = await getCustomer()

  return <CartTemplate cart={cart} customer={customer} />
}
