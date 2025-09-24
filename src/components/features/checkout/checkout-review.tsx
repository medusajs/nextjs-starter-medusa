"use client"

import { Fragment } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

import { PaymentButton } from "@/components/features/checkout/payment-button"

type Props = {
  cart?: any
}

function Review({ cart }: Props) {
  const t = useTranslations("features.checkout.review")
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className="bg-background">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2
          className={cn(
            "flex text-xl lg:text-2xl font-medium gap-x-2 items-center",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          4. {t("summary.title")}
        </h2>
      </div>
      {isOpen && previousStepsCompleted && (
        <Fragment>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <p className="font-medium text-foreground mb-1">
                {t("summary.description")}
              </p>
            </div>
          </div>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </Fragment>
      )}
    </div>
  )
}

export { Review }
export type { Props as ReviewProps }
