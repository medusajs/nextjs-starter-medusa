import DiscountCode from "@modules/checkout/components/discount-code"
import GiftCard from "@modules/checkout/components/gift-card"
import PaymentButton from "@modules/checkout/components/payment-button"
import CartTotals from "@modules/common/components/cart-totals"
import { useCart } from "medusa-react"

const CheckoutSummary = () => {
  const { cart } = useCart()

  if (!cart?.id) {
    return null
  }

  return (
    <div className="sticky top-0 flex flex-col gap-y-8">
      <div className="w-full bg-white p-6 flex flex-col gap-y-6">
        <CartTotals cart={cart} />
        <PaymentButton paymentSession={cart?.payment_session} />
      </div>
      <DiscountCode cart={cart} />
      <GiftCard cart={cart} />
    </div>
  )
}

export default CheckoutSummary
