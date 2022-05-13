import OrderDetails from "@modules/account/components/order-details"
import { useOrder } from "medusa-react"
import { useRouter } from "next/router"

const OrderDetailsTemplate = () => {
  const router = useRouter()

  const { order } = router.query

  const { order: details, isLoading } = useOrder(order as string, {
    enabled: !!order,
  })

  if (isLoading || !details) {
    return <div>Loading...</div>
  }

  return <OrderDetails order={details} />
}

export default OrderDetailsTemplate
