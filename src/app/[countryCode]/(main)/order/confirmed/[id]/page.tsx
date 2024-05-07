import { Metadata } from "next"

import { LineItem, Order } from "@medusajs/medusa"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import { notFound } from "next/navigation"
import { enrichLineItems } from "@lib/data/cart"
import { retrieveOrder } from "@lib/data/orders"

type Props = {
  params: { id: string }
}

async function getOrder(id: string) {
  const order = await retrieveOrder(id)

  if (!order) {
    return
  }

  const enrichedItems = await enrichLineItems(order.items, order.currency_code)

  return {
    ...order,
    items: enrichedItems as LineItem[],
  } as Order
}

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "You purchase was successful",
}

export default async function OrderConfirmedPage({ params }: Props) {
  const order = await getOrder(params.id)
  if (!order) {
    return notFound()
  }

  return <OrderCompletedTemplate order={order} />
}
