import { getCustomer } from "@lib/data"
import { retrieveCart } from "@lib/data/cart"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"

export default async function CheckoutForm() {
  let cart = await retrieveCart()
  if (!cart) {
    return null
  }

  const availableShippingMethods = await listCartShippingMethods(cart.id)
  const availablePaymentMethods = await listCartPaymentMethods(
    cart.region?.id ?? ""
  )
  const customer = await getCustomer()

  return (
    <div>
      <div className="w-full grid grid-cols-1 gap-y-8">
        <div>
          <Addresses cart={cart} customer={customer} />
        </div>

        <div>
          <Shipping
            cart={cart}
            availableShippingMethods={availableShippingMethods}
          />
        </div>

        <div>
          <Payment
            cart={cart}
            availablePaymentMethods={availablePaymentMethods ?? []}
          />
        </div>

        <div>
          <Review cart={cart} />
        </div>
      </div>
    </div>
  )
}
