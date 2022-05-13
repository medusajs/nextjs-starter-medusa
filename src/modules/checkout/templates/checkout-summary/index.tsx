import CheckoutTotals from "@modules/checkout/components/checkout-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import PaymentButton from "@modules/checkout/components/payment-button"
import { useCart } from "medusa-react"
import React from "react"

const CheckoutSummary = () => {
  const { cart } = useCart()

  if (!cart?.id) {
    return null
  }

  return (
    <div className="lg:sticky top-0 w-full py-8 px-4 lg:px-0 lg:pr-4">
      <div className="lg:max-w-xl w-full bg-white p-10 flex flex-col gap-y-4">
        <DiscountCode cart={cart} />
        <CheckoutTotals cart={cart} />
        <PaymentButton paymentSession={cart?.payment_session} />
      </div>
    </div>
  )
}

export default CheckoutSummary
