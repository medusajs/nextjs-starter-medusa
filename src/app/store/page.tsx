import { Metadata } from "next"
import Store from "./store"
import PageLayout from "app/page-layout"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

export default function StorePage() {
  return (
    <PageLayout>
      <Store />
    </PageLayout>
  )
}
