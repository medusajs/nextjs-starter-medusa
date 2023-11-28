import { Metadata } from "next"
import ShopTemplate from "@modules/shop/templates"

export const metadata: Metadata = {
  title: "Shop",
  description: "Explore all of our products.",
}

export default function ShopPage() {
  return <ShopTemplate />
}
