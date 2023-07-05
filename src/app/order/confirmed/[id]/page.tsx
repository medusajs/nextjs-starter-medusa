import medusaRequest from "@lib/medusa-fetch"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import PageLayout from "app/page-layout"

type Props = {
  params: { id: string }
}

export default async function CollectionPage({ params }: Props) {
  const { order } = await medusaRequest("GET", `/orders/${params.id}`).then(
    (res) => res.body
  )

  return (
    <PageLayout>
      <OrderCompletedTemplate order={order} />
    </PageLayout>
  )
}
