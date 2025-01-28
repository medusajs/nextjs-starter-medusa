import { useTranslations, useFormatter } from "next-intl"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const t = useTranslations()
  const format = useFormatter()
  
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  const formattedDate = format.dateTime(new Date(order.created_at), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div>
      <Text>
        {t('ORDER_CONFIRMATION_SENT_TO')}{" "}
        <span
          className="text-ui-fg-medium-plus font-semibold"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </Text>
      <Text className="mt-2">
        {t('ORDER_DATE')}{" "}
        <span data-testid="order-date">
          {formattedDate}
        </span>
      </Text>
      <Text className="mt-2 text-ui-fg-interactive">
        {t('ORDER_NUMBER_WITH_COLON')} <span data-testid="order-id">{order.display_id}</span>
      </Text>

      <div className="flex items-center text-compact-small gap-x-4 mt-4">
        {showStatus && (
          <>
            <Text>
            {t('ORDER_STATUS')}{" "}
              <span className="text-ui-fg-subtle " data-testid="order-status">
                {/* TODO: Check where the statuses should come from */}
                {/* {formatStatus(order.fulfillment_status)} */}
              </span>
            </Text>
            <Text>
              {t('PAYMENT_STATUS_WITH_COLON')}{" "}
              <span
                className="text-ui-fg-subtle "
                sata-testid="order-payment-status"
              >
                {/* {formatStatus(order.payment_status)} */}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
