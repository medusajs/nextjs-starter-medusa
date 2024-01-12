import { Metadata } from "next"

import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import { retrieveOrder } from "@lib/data"
import { notFound } from "next/navigation"
import { enrichLineItems } from "@modules/cart/actions"
import { LineItem, Order } from "@medusajs/medusa"

type Props = {
  params: { id: string }
}

async function getOrder(id: string) {
  const order = await retrieveOrder(id)

  if (!order) {
    return notFound()
  }

  const enrichedItems = await enrichLineItems(order.items, order.region_id)

  return {
    order: {
      ...order,
      items: enrichedItems as LineItem[],
    } as Order,
  }
}

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "You purchase was successful",
}

export default async function OrderConfirmedPage({ params }: Props) {
  const { order } = await getOrder(params.id)

  return <OrderCompletedTemplate order={order} />
}
