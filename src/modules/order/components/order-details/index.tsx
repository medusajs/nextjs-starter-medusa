import { Order } from "@medusajs/medusa"
import { Text } from "@medusajs/ui"

type OrderDetailsProps = {
  order: Order
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div>
      <Text>
        We have sent the order confirmation details to{" "}
        <span className="font-semibold text-ui-fg-medium-plus" data-testid="order-email">
          {order.email}
        </span>
        .
      </Text>
      <Text className="mt-2">
        Order date: <span data-testid="order-date">{new Date(order.created_at).toDateString()}</span>
      </Text>
      <Text className="mt-2 text-ui-fg-interactive">
        Order #<span data-testid="order-id">{order.display_id}</span>
      </Text>

{/* TODO check if we want to pass the showStatus prop to show the customer order status or payment status details? */}
      <div className="flex items-center mt-4 text-compact-small gap-x-4">
        {showStatus && (
          <>
            <Text>
              Order status:{" "}
              <span className="text-ui-fg-subtle " data-testid="order-status">
                {formatStatus(order.fulfillment_status)}
              </span>
            </Text>
            <Text>
              Payment status:{" "}
              <span className="text-ui-fg-subtle " sata-testid="order-payment-status">
                {formatStatus(order.payment_status)}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
