"use client"
import { Order } from "@medusajs/medusa"
import { Heading, Text } from "@medusajs/ui"
import OrderDetails from "../order-details"
import PickUpInfo from "../pick-up-info"

import { useEffect, useState } from "react"
import BankPaymentInstructions from "../bank-payment-instructions"

type OrderConfirmedProps = {
  order: Order
}

const OrderConfirmed = ({ order}: OrderConfirmedProps) => {
  
  const [isManualPayment, setIsManualPayment] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    setIsManualPayment(order.payments[0].provider_id === "manual");
  }, [order.payments]);


console.log('provider_id:', order.payments[0].provider_id);
console.log('Condition result:', order.payments[0].provider_id !== "manual");
console.log('isManualPayment:', isManualPayment);

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
      <div className="flex flex-col space-y-2">
        <Heading
          level="h1"
          className="flex flex-col mb-3 text-3xl gap-y-3 text-ui-fg-base"
        >
          <span>Almost there!</span>
          <span>😊 🥦</span>
        </Heading>
        <BankPaymentInstructions order={order} />
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
 