import { Order } from "@medusajs/medusa"

type OrderDetailsProps = {
  order: Order
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const items = order.items.reduce((acc, i) => acc + i.quantity, 0)

  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className="p-10 border-b border.gray-200">
      <span className="text-gray-700 text-small-regular uppercase">
        Thank you, your order was successfully placed
      </span>
      <h1 className="mt-2 uppercase text-2xl-semi">#{order.display_id}</h1>
      <span>{order.id.split("order_")[1]}</span>
      <div className="flex items-center text-gray-700 text-small-regular gap-x-4 mt-4">
        <span>{new Date(order.created_at).toDateString()}</span>
        <span>{`${items} ${items !== 1 ? "items" : "item"}`}</span>
        {showStatus && (
          <>
            <span>{formatStatus(order.fulfillment_status)}</span>
            <span>{formatStatus(order.payment_status)}</span>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
