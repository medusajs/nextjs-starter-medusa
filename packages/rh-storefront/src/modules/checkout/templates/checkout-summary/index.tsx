import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0 small:sticky small:top-0">
      <div className="w-full bg-qw-white flex flex-col border border-qw-pale-grey">
        <Divider className="my-6 small:hidden" />
        <Heading
          level="h2"
          className="font-serif font-light text-[32px] leading-tight uppercase tracking-[0.12em] items-baseline"
        >
          In your Cart
        </Heading>
        <Divider className="my-6" />
        <CartTotals totals={cart} />
        <ItemsPreviewTemplate cart={cart} />
        <div className="my-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
