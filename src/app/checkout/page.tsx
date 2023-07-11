import CheckoutTemplate from "@modules/checkout/templates"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout",
}

export default function Checkout() {
  return <CheckoutTemplate />
}
