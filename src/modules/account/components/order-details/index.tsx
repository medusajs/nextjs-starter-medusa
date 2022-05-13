import { Order } from "@medusajs/medusa"
import React, { useMemo } from "react"

type OrderDetailsProps = {
  order: Order
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  return (
    <div className="bg-white p-10 max-w-7xl w-full">
      <h1 className="text-2xl-semi uppercase">Your order</h1>
      <div className="mt-2 flex flex-col gap-y-8">
        <Details order={order} />
        <Address order={order} />
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
          <Payment order={order} />
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

const Payment = ({ order }: OrderDetailsProps) => {
  const paymentType = useMemo(() => {
    const provider = order.payments?.[0]?.provider_id

    switch (provider) {
      case "stripe":
        return "Credit Card"
      case "paypal":
        return "PayPal"
      case "adyen":
        return "Credit Card"
      case "klarna":
        return "Klarna"
      case "manual":
        return "Medusa Test Payment"
      default:
        return "Unknown"
    }
  }, [order])

  return (
    <div className="flex flex-col gap-x-2">
      <span className="text-base-semi">Payment</span>
      <span className="text-small-regular">{paymentType}</span>
    </div>
  )
}

const Shipment = ({ order }: OrderDetailsProps) => {
  const shipmentType = useMemo(() => {
    const provider = order.fulfillments?.[0]?.provider?.id

    switch (provider) {
      case "stripe":
        return "Credit Card"
      case "paypal":
        return "PayPal"
      case "adyen":
        return "Credit Card"
      case "klarna":
        return "Klarna"
      case "manual":
        return "Medusa Test Payment"
      default:
        return "Unknown"
    }
  }, [order])

  return (
    <div className="flex flex-col gap-x-2">
      <span className="text-base-semi">Payment</span>
      <span className="text-small-regular">{shipmentType}</span>
    </div>
  )
}

const Address = ({ order }: OrderDetailsProps) => {
  const { shipping_address } = order
  return (
    <div>
      <h3 className="text-large-semi uppercase">Address</h3>
      <div className="text-gray-700 text-small-regular flex flex-col mt-2">
        <span>
          {shipping_address.first_name} {shipping_address.last_name}
        </span>
        <span>
          {shipping_address.address_1},
          {shipping_address.address_2 && (
            <span> {shipping_address.address_2}</span>
          )}
        </span>
        <span>
          {shipping_address.postal_code}, {shipping_address.city}
        </span>
        <span>
          {shipping_address.province && (
            <span>{shipping_address.province}, </span>
          )}
          {shipping_address.country_code?.toUpperCase()}
        </span>
      </div>
    </div>
  )
}

const OrderTotal = ({ order }: OrderDetailsProps) => {
  return (
    <div>
      <div></div>
    </div>
  )
}

export default OrderDetails
