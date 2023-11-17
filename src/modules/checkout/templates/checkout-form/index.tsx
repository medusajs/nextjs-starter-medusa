"use client"

import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import { useCart } from "medusa-react"

const CheckoutForm = () => {
  const { cart } = useCart()

  if (!cart?.id) {
    return null
  }

  return (
    <div>
      <div className="w-full grid grid-cols-1 gap-y-8">
        <div>
          <Addresses />
        </div>

        <div>
          <Shipping cart={cart} />
        </div>

        <div>
          <Payment />
        </div>

        <div>
          <Review />
        </div>
      </div>
    </div>
  )
}

export default CheckoutForm
