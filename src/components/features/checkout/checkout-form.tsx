import { listCartShippingMethods } from "@/utils/data/fulfillment"
import { listCartPaymentMethods } from "@/utils/data/payment"

import { Addresses } from "@/components/features/checkout/checkout-addresses"
import { Review } from "@/components/features/checkout/checkout-review"
import { Shipping } from "@/components/features/checkout/checkout-shipping"
import { Payment } from "@/components/features/checkout/checkout-payment"

import type { HttpTypes } from "@medusajs/types"

type Props = {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}

async function CheckoutForm({ cart, customer }: Props) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} />

      <Shipping cart={cart} availableShippingMethods={shippingMethods} />

      <Payment cart={cart} availablePaymentMethods={paymentMethods} />

      <Review cart={cart} />
    </div>
  )
}

export { CheckoutForm }
export type { Props as CheckoutFormProps }
