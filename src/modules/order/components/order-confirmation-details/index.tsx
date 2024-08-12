"use client"
import { Order } from "@medusajs/medusa"
import { Heading, Text } from "@medusajs/ui"
import OrderDetails from "../order-details"
import PickUpInfo from "../pick-up-info"
import Spinner from "@modules/common/icons/spinner"

import { useEffect, useState } from "react"
import BankPaymentInstructions from "../bank-payment-instructions"

type OrderConfirmationDetailsProps = {
  order: Order
}

const OrderConfirmationDetails = ({ order}: OrderConfirmationDetailsProps) => {
  
  // check if payment is manual or stripe so we can dynamically render the correct components and information to the user
  const [isManualPayment, setIsManualPayment] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    setIsManualPayment(order.payments[0].provider_id === "manual");
  }, [order.payments]);


if (isManualPayment === undefined) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Spinner />
    </div>
  );
}

// if payment is manual, let customer know how to complete their order via bank transfer
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

// if payment is  stripe, order is succesful, show order details and pick up info
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

export default OrderConfirmationDetails
 