import { Order } from "@medusajs/medusa"
import React from "react"

type OrderDetailsProps = {
  order: Order
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  return (
    <div className="bg-white p-10 max-w-7xl w-full">
      <h1 className="text-2xl-semi uppercase">Your order</h1>
      <div className="mt-2 flex flex-col gap-y-8">
        <Details order={order} />
        <Details order={order} />
        <Details order={order} />
      </div>
    </div>
  )
}

const ShippingStatus = ({ order }: OrderDetailsProps) => {
  return <div></div>
}

const Details = ({ order }: OrderDetailsProps) => {
  return (
    <div className="flex flex-col w-full gap-y-4">
      <h3 className="text-large-semi uppercase">Details</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="flex flex-col gap-x-2">
          <span className="text-base-semi mb-1">Order</span>
          <span className="text-small-regular">ID #{order.display_id}</span>
          <span className="text-small-regular">
            {new Date(order.created_at).toDateString()}
          </span>
        </div>
        <div>
          <span className="text-base-semi">Payment</span>
          <span>ID #{order.display_id}</span>
          <span>{new Date(order.created_at).toDateString()}</span>
        </div>
        <div>
          <span className="text-base-semi">Shipping</span>
          <span>ID #{order.display_id}</span>
          <span>{new Date(order.created_at).toDateString()}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
