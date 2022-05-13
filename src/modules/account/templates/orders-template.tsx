import Spinner from "@modules/common/icons/spinner"
import { useCustomerOrders } from "medusa-react"
import React from "react"
import OrderCard from "../components/order-card"

const OrdersTemplate = () => {
  const { orders, isLoading } = useCustomerOrders()

  if (isLoading) {
    return (
      <div className="text-gray-900 w-full flex justify-center pt-12">
        <Spinner size={36} />
      </div>
    )
  }

  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-8 max-w-7xl w-full">
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </div>
    )
  }

  return (
    <div className="p-12">
      <div>You don&apos;t have any orders yet</div>
    </div>
  )
}

export default OrdersTemplate
