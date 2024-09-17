import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getI18n } from "../../../../../../../../locales/server"

import { retrieveOrder } from "@lib/data"
import OrderDetailsTemplate from "@modules/order/templates/order-details-template"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getI18n()
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  return {
    title: t("page.order.title") + ` #${order.display_id}`,
    description: t("page.order.desc"),
  }
}

export default async function OrderDetailPage({ params }: Props) {
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  return <OrderDetailsTemplate order={order} />
}
