"use client"

import { Heading, Text, clx } from "@medusajs/ui"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
import { Cart } from "@medusajs/medusa"

const Review = ({
  cart,
}: {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  // TODo remove paid by gift card logic
  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0
  
    
    // returns true if payment session is not null. !! used to convert payment session object to a boolean
    const previousStepsCompleted = !!cart.payment_session  

    // returns true if user selected manual payment option
    const isManualPayment = cart.payment_session?.provider_id === "manual"

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Review
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="flex items-start w-full mb-6 gap-x-1">
            <div className="w-full">
              <Text className="mb-1 txt-medium-plus text-ui-fg-base">
              Double-check that everything looks correct, then click the Place Order button to confirm your order. 
              </Text>
              {/* if manual payment, advice the user about bank details, if stripe peayment, advise the user about pick up details */}
              {isManualPayment ? (
                <Text>Information to complete your bank transfer will show once your order has been placed.</Text>
                ): (<Text>Details to pick up your order will show once your order has been placed.</Text>)
              }
              
            </div>
          </div>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </div>
  )
}

export default Review
