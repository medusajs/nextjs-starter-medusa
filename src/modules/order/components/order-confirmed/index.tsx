"use client"
import { Order } from "@medusajs/medusa"
import { Heading, Text } from "@medusajs/ui"
import OrderDetails from "../order-details"
import PickUpInfo from "../pick-up-info"

import { useEffect, useState } from "react"

type OrderConfirmedProps = {
  order: Order
}

const OrderConfirmed = ({ order}: OrderConfirmedProps) => {
  
  const [isManualPayment, setIsManualPayment] = useState<boolean | undefined>(undefined);
  // const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsManualPayment(order.payments[0].provider_id === "manual");
    // setIsLoading(false)
  }, [order.payments]);


console.log('provider_id:', order.payments[0].provider_id);
console.log('Condition result:', order.payments[0].provider_id !== "manual");
console.log('isManualPayment:', isManualPayment);
// console.log(isLoading)

if (isManualPayment === undefined) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="loader">Processing...</div>
    </div>
  );
}

if (isManualPayment) {
  return (
    <>
      <Heading
            level="h1"
            className="flex flex-col mb-3 text-3xl gap-y-3 text-ui-fg-base"
          >
            <span>Almost there!</span>
            <span>😊 🥦</span>
          </Heading>
          <Heading level="h2" className="text-2xl-regular">
            Bank payment instructions
          </Heading>
          <Text>
          Thanks for using our platform! You are one step away from completing your order! 
          The final step is to manually transfer us the money. You can find the transfer details below. 
          Please put the <span className="font-semibold">order number #<span data-testid="order-id">{order.display_id}</span></span> in the reference field.
          </Text>
          <Text>
          </Text>
          <div className="flex flex-col space-y-2">
            <Heading level="h3" className="text-xl-regular">Payment details</Heading>
            <Text><span className="font-semibold">Bank account name:</span> CoShop</Text>
            <Text><span className="font-semibold">Account number:</span> 1234 5678 9012</Text>
            <Text><span className="font-semibold">Reference:</span> {order.display_id}</Text>
            {/* TODO format the total amount */}
            <Text><span className="font-semibold">Amount due (incl tax):</span> {order.total}</Text> 
          <Text>NOTE: Your order is not ready until you have paid the amount due.</Text>
          <Text>If you have any questions or feedback, reach out to <a className="underline" href="mailto:orders@coshop.nz">orders@coshop.nz</a></Text>
          </div>
    </>
  );
}

return (
  <div>
    <Heading
      level="h1"
      className="flex flex-col mb-3 text-3xl gap-y-3 text-ui-fg-base"
    >
      <span>Thank you!</span>
      <span className="flex flex-col text-xl text-ui-fg-base">Your order was placed successfully.</span>
    </Heading>
    <OrderDetails order={order} />
    <PickUpInfo order={order} />
  </div>
);
}

export default OrderConfirmed
 