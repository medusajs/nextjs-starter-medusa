import useEnrichedLineItems from "@lib/hooks/use-enrich-line-items"
import DiscountCode from "@modules/checkout/components/discount-code"
import { useCart, useMeCustomer } from "medusa-react"
import SignInPrompt from "../components/sign-in-prompt"
import ItemsTemplate from "./items"
import Summary from "./summary"

const CartTemplate = () => {
  const { cart } = useCart()
  const { customer, isLoading } = useMeCustomer()
  const items = useEnrichedLineItems()

  return (
    <div className="bg-gray-100 border-b border-gray-200 min-h-screen">
      <div className="grid grid-cols-[1fr_360px] max-w-6xl mx-auto gap-x-8 py-12">
        <div className="flex flex-col gap-y-8">
          {!customer && !isLoading && <SignInPrompt />}
          <ItemsTemplate region={cart?.region} items={items} />
        </div>
        <div className="relative">
          <div className="flex flex-col gap-y-8 sticky top-12">
            {cart && cart.region && (
              <>
                <Summary cart={cart} />
                <DiscountCode cart={cart} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartTemplate
