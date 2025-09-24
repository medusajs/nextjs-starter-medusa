import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { listOrders } from "@/utils/data/orders"
import { generateMeta } from "@/utils/meta/generate-meta"

import { Separator } from "@/components/ui/primitives/separator"
import { TransferRequestForm } from "@/components/features/account/forms/transfer-request-form"
import { OrderCard } from "@/components/features/account/cards/order-card"

type Props = {
  params: Promise<{
    countryCode: string
  }>
}

export async function generateMetadata({ params }: Props) {
  const { countryCode } = await params
  const t = await getTranslations("pages.account.orders.meta")

  return generateMeta({
    meta: {
      title: t("title"),
      description: t("description"),
    },
    slug: [countryCode, "account", "orders"],
  })
}

export default async function OrdersPage() {
  const orders = await listOrders().catch(() => null)

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="flex flex-col gap-y-8 w-full">
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </div>
      <Separator className="my-10" />
      <TransferRequestForm />
    </div>
  )
}
