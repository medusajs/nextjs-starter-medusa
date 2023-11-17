"use client"

import useEnrichedLineItems from "@lib/hooks/use-enrich-line-items"
import SkeletonCartPage from "@modules/skeletons/templates/skeleton-cart-page"
import { useCart, useMeCustomer } from "medusa-react"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import ItemsTemplate from "./items"
import Summary from "./summary"
import Divider from "@modules/common/components/divider"

const CartTemplate = () => {
  const { cart } = useCart()
  const { customer, isLoading } = useMeCustomer()
  const items = useEnrichedLineItems()

  if (!cart || !cart?.id?.length || isLoading) {
    return <SkeletonCartPage />
  }

  return (
    <div className="py-12">
      <div className="content-container">
        {cart.items.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-40">
            <div className="flex flex-col bg-white p-6 gap-y-6">
              {!customer && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )}

              <ItemsTemplate region={cart?.region} items={items} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {cart && cart.region && (
                  <>
                    <div className="bg-white p-6">
                      <Summary cart={cart} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
