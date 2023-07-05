import medusaRequest from "@lib/medusa-fetch"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import { Metadata } from "next"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { order } = await medusaRequest("GET", `/orders/${params.id}`).then(
    (res) => res.body
  )

  return {
    title: `Order #${order.display_id}`,
    description: `View your order`,
  }
}

export default async function CollectionPage({ params }: Props) {
  const { order } = await medusaRequest("GET", `/orders/${params.id}`).then(
    (res) => res.body
  )

  return <OrderCompletedTemplate order={order} />
}
