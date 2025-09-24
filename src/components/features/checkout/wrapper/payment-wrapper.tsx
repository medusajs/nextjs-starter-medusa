"use client"

import React from "react"

import { loadStripe } from "@stripe/stripe-js"
import { isStripe } from "@/lib/type-guard"

import { StripeWrapper } from "@/components/features/checkout/wrapper/stripe-wrapper"

import type { HttpTypes } from "@medusajs/types"

type Props = {
  cart: HttpTypes.StoreCart
  children: React.ReactNode
}

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

function PaymentWrapper({ cart, children }: Props) {
  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  if (
    isStripe(paymentSession?.provider_id) &&
    paymentSession &&
    stripePromise
  ) {
    return (
      <StripeWrapper
        paymentSession={paymentSession}
        stripeKey={stripeKey}
        stripePromise={stripePromise}
      >
        {children}
      </StripeWrapper>
    )
  }

  return <div>{children}</div>
}

export { PaymentWrapper }
export type { Props as PaymentWrapperProps }
