import CheckoutItems from "@modules/checkout/components/checkout-items"
import CheckoutTotals from "@modules/checkout/components/checkout-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import { useCart } from "medusa-react"
import React from "react"

const CheckoutSummary = () => {
  const { cart } = useCart()
  return (
    <div className="w-full">
      <CheckoutItems items={cart?.items} region={cart?.region} />
      <CheckoutTotals
        region={cart?.region}
        subtotal={cart?.subtotal}
        shippingTotal={cart?.shipping_total}
        taxTotal={cart?.tax_total}
        total={cart?.total}
      />
      <DiscountCode />
    </div>
  )
}

export default CheckoutSummary
