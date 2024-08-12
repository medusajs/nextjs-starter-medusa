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
                By clicking the Place Order button, you confirm that you have
                read, understand and accept our Terms of Use, Terms of Sale and
                Returns Policy and acknowledge that you have read Medusa
                Store&apos;s Privacy Policy.
              </Text>
            </div>
          </div>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </div>
  )
}

export default Review
