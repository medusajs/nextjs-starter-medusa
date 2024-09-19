"use client"

import { Stripe, StripeElementsOptions } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

import {  useScopedI18n } from '../../../../locales/client'

import { PaymentSession } from "@medusajs/medusa"

type StripeWrapperProps = {
    paymentSession: PaymentSession
    stripeKey?: string
    stripePromise: Promise<Stripe | null> | null
    children: React.ReactNode
  }

const StripeWrapper: React.FC<StripeWrapperProps> = ({
    paymentSession,
    stripeKey,
    stripePromise,
    children,
  }) => {
    const options: StripeElementsOptions = {
      clientSecret: paymentSession!.data?.client_secret as string | undefined,
    }

    const t = useScopedI18n("checkout.payment.stripe")
  
    if (!stripeKey) {
      throw new Error(t("error1"))
    }
  
    if (!stripePromise) {
      throw new Error(t("error2"))
    }
  
    if (!paymentSession?.data?.client_secret) {
      throw new Error(t("error3"))
    }
  
    return (
      <Elements options={options} stripe={stripePromise}>
        {children}
      </Elements>
    )
  }

  export default StripeWrapper