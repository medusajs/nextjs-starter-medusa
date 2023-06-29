import { Metadata } from "next"
import Store from "./store"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

export default function StorePage() {
  return <Store />
}
