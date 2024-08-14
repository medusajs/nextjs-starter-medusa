import { Order } from "@medusajs/medusa"
import { Heading, Text } from "@medusajs/ui"
import { formatAmount } from "@lib/util/prices"

import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: Order
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div>
      <Heading level="h3" className="flex flex-row my-6 sr-only text-xl-regular">
        Order details
      </Heading>
      <div className="flex items-start mt-6 gap-x-8">
        <div className="flex flex-col w-1/3" data-testid="shipping-address-summary">
          <Heading level="h3" className="mb-1 txt-large-plus text-ui-fg-base">
            Personal details
          </Heading>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address.first_name}{" "}
            {order.shipping_address.last_name}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address.phone}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">{order.email}</Text>
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default ShippingDetails
