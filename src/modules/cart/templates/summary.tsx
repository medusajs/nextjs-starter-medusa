import { Cart } from "@medusajs/medusa"
import { Button, Heading } from "@medusajs/ui"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import Link from "next/link"

type SummaryProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

const Summary = ({ cart }: SummaryProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Summary
      </Heading>
      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals data={cart} />
      <Link href="/checkout">
        <Button className="w-full h-10">Go to checkout</Button>
      </Link>
    </div>
  )
}

export default Summary
