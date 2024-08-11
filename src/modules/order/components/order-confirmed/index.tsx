"use client"
import { Order } from "@medusajs/medusa"
import { Heading, Text } from "@medusajs/ui"
import OrderDetails from "../order-details"

import { useEffect, useState } from "react"

type OrderConfirmedProps = {
  order: Order
}


const isManual = (order: Order) => {
  console.log('provider_id:', order.payments[0].provider_id);
  console.log('Condition result:', order.payments[0].provider_id !== "manual");
  return order.payments[0].provider_id === "manual";
}

const OrderConfirmed = ({ order}: OrderConfirmedProps) => {
  
  const [isManualPayment, setIsManualPayment] = useState(false);

  useEffect(() => {
    setIsManualPayment(order.payments[0].provider_id === "manual");
  }, [order.payments]);

  if (isManualPayment === undefined) {
    return null; // or a loading indicator if necessary
  }

  console.log('provider_id:', order.payments[0].provider_id);
console.log('Condition result:', order.payments[0].provider_id !== "manual");
console.log('isManualPayment:', isManualPayment);

if (isManualPayment) {
  return (
    <>
      <Heading
            level="h1"
            className="flex flex-col mb-4 text-3xl gap-y-3 text-ui-fg-base"
          >
            <span>Almost there!</span>
            <span>😊 🥦</span>
          </Heading>
          <Heading level="h3" className="flex flex-row text-3xl-regular">
            Bank payment instructions
          </Heading>
          <Text>
          Thanks for using our platform! You are one step away from completing your order! 
          The final step is to manually transfer us the money. You can find the transfer details below. 
          Please put the <span className="font-semibold">order number #<span data-testid="order-id">{order.display_id}</span></span> in the reference field.
          </Text>
          <Text>
          <Text>NOTE: Your order is not ready until you have paid the amount due.</Text>
          </Text>
          <div className="flex flex-col space-y-2">
            <Text weight={"plus"} className="underline">Payment details</Text>
            <Text><span className="font-semibold">Bank account name:</span> CoShop</Text>
            <Text><span className="font-semibold">Account number:</span> 1234 5678 9012</Text>
            <Text><span className="font-semibold">Reference:</span> {order.display_id}</Text>
            {/* TODO format the total amount */}
            <Text><span className="font-semibold">Amount due (incl tax):</span> {order.total}</Text> 
          </div>
    </>
  );
}

return (
  <div>
    <h1>Thank you! Your order was placed successfully.</h1>
    {/* Regular order confirmation */}
  </div>
);
}

export default OrderConfirmed
 