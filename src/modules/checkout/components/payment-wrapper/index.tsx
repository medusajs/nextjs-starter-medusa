import { PaymentSession } from "@medusajs/medusa"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js"
import React from "react"

type WrapperProps = {
  paymentSession?: PaymentSession | null
  selectedProviderId: string | null
}

const Wrapper: React.FC<WrapperProps> = ({
  selectedProviderId,
  paymentSession,
  children,
}) => {
  if (!selectedProviderId || !paymentSession) {
    return <div>{children}</div>
  }

  if (
    paymentSession?.provider_id === "stripe" ||
    selectedProviderId === "stripe"
  ) {
    return (
      <StripeWrapper
        selectedProviderId={selectedProviderId}
        paymentSession={paymentSession}
      >
        {children}
      </StripeWrapper>
    )
  }

  return <div>{children}</div>
}

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

const StripeWrapper: React.FC<WrapperProps> = ({
  paymentSession,
  children,
}) => {
  const options: StripeElementsOptions = {
    clientSecret: paymentSession!.data?.client_secret as string | undefined,
  }

  if (!stripePromise) {
    return <div>{children}</div>
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}

export default Wrapper
