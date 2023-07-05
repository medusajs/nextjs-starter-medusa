import medusaRequest from "@lib/medusa-fetch"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import { Metadata } from "next"

type Props = {
  params: { id: string }
}

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "You purchase was successful",
}

export default async function CollectionPage({ params }: Props) {
  const { order } = await medusaRequest("GET", `/orders/${params.id}`).then(
    (res) => res.body
  )

  return <OrderCompletedTemplate order={order} />
}
