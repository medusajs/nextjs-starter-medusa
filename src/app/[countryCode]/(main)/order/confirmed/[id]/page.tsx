import { Metadata } from "next"

import { getI18n } from "../../../../../../locales/server"

import { retrieveOrder } from "@lib/data"
import { LineItem, Order } from "@medusajs/medusa"
import { enrichLineItems } from "@modules/cart/actions"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import { notFound } from "next/navigation"

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
  title: "order.confirmed_title",
  description: "oder.confirmed_desc",
}

export default async function OrderConfirmedPage({ params }: Props) {
  const t = await getI18n()
  metadata.title = t("order.confirmed_title")
  metadata.description = t("order.confirmed_desc")

  const { order } = await getOrder(params.id)

  return <OrderCompletedTemplate order={order} />
}
