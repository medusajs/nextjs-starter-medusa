import useEnrichedLineItems from "@lib/hooks/use-enrich-line-items"
import DiscountCode from "@modules/checkout/components/discount-code"
import { useCart, useMeCustomer } from "medusa-react"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import ItemsTemplate from "./items"
import Summary from "./summary"

const CartTemplate = () => {
  const { cart } = useCart()
  const { customer, isLoading } = useMeCustomer()
  const items = useEnrichedLineItems()

  return (
    <div className="content-container">
      {cart?.items?.length ? (
        <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-8 py-12">
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
      ) : (
        <div>
          {!customer && !isLoading && <SignInPrompt />}
          <EmptyCartMessage />
        </div>
      )}
    </div>
  )
}

export default CartTemplate
