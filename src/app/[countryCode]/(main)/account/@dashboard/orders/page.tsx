import { Metadata } from "next"

import { getI18n, setStaticParams } from "../../../../../../locales/server"

import OrderOverview from "@modules/account/components/order-overview"
import { listCustomerOrders } from "@lib/data"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "page.orders.title",
  description: "page.orders.desc",
}

type Props = {
  params: { countryCode: string; }
}

export default async function Orders({ params }: Props) {
  setStaticParams(params.countryCode)
  const t = await getI18n()
  metadata.title = t("page.orders.title")
  metadata.description = t("page.orders.desc")

  const orders = await listCustomerOrders()

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">{t("page.orders.title")}</h1>
        <p className="text-base-regular">{t("page.orders.details")}</p>
      </div>
      <div>
        <OrderOverview orders={orders} />
      </div>
    </div>
  )
}
