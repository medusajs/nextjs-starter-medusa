import Address from "@modules/checkout/components/address"
import Email from "@modules/checkout/components/email"
import Payment from "@modules/checkout/components/payment"
import Shipping from "@modules/checkout/components/shipping"
import { useCart } from "medusa-react"
import React from "react"

const CheckoutForm = () => {
  const { cart } = useCart()

  if (!cart?.id) {
    return null
  }

  return (
    <div className="w-full flex justify-center lg:border-r lg:border-gray-200 lg:py-8">
      <div className="w-full lg:max-w-2xl px-4 py-8 lg:p-0 flex flex-col gap-y-16">
        <Email cart={cart} />

        <Address cart={cart} />

        <Shipping cart={cart} />

        <Payment />
      </div>
    </div>
  )
}

export default CheckoutForm
