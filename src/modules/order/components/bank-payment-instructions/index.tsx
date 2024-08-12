
"use client"
import { Order } from "@medusajs/medusa"
import { Heading, Text } from "@medusajs/ui"
import { formatAmount } from "@lib/util/prices"

type BankPaymentInstructionsProps = {
  order: Order
}

const BankPaymentInstructions: React.FC<BankPaymentInstructionsProps> = ({ order })  => {

  const getAmount = (amount: number | null | undefined) => {
    return formatAmount({
      amount: amount || 0,
      region: order.region,
      includeTaxes: false,
    })
  }

  return (
    <div className="flex flex-col gap-y-3">
      <Heading level="h2" className="text-2xl-regular">
        Bank payment instructions
      </Heading>
      <Text>
      Thanks for using our platform! You are one step away from completing your order!
      The final step is to manually transfer us the money. You can find the transfer details below.
      Please put the <span className="font-semibold">order number #<span data-testid="order-id">{order.display_id}</span></span> in the reference field.
      </Text>
    
      <div className="flex flex-col space-y-2">
        <Text><span className="font-semibold">Bank account name:</span> CoShop</Text>
        <Text><span className="font-semibold">Account number:</span> 1234 5678 9012</Text>
        <Text><span className="font-semibold">Reference:</span> {order.display_id}</Text>
        <Text><span className="font-semibold">Amount due (incl tax):</span> {getAmount(order.total)}</Text>
      <Text>NOTE: Your order is not ready until you have paid the amount due.</Text>
      <Text>If you have any questions or feedback, reach out to <a className="underline" href="mailto:orders@coshop.nz">orders@coshop.nz</a></Text>
      </div>
    </div>
  )
}

export default BankPaymentInstructions
