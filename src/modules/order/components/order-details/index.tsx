import { Order } from "@medusajs/medusa"
import React from "react"

type OrderDetailsProps = {
  order: Order
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const items = order.items.reduce((acc, i) => acc + i.quantity, 0)

  return (
    <div className="p-10 border-b border.gray-200">
      <span className="text-gray-700 text-small-regular uppercase">
        Thank you, your order was successfully placed
      </span>
      <h1 className="mt-2 uppercase text-large-semi">
        Order ID: {order.id.split("_")[1]}
      </h1>
      <div className="flex items-center text-gray-700 text-small-regular gap-x-4 mt-4">
        <span>{new Date(order.created_at).toDateString()}</span>
        <span>{`${items} ${items !== 1 ? "items" : "item"}`}</span>
      </div>
    </div>
  )
}

export default OrderDetails
