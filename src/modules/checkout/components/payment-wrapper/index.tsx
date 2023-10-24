import { PaymentSession } from "@medusajs/medusa"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js"
import React from "react"

type WrapperProps = {
  paymentSession?: PaymentSession | null
}

const Wrapper: React.FC<WrapperProps> = ({ paymentSession, children }) => {
  if (!paymentSession) {
    return <div>{children}</div>
  }

  switch (paymentSession.provider_id) {
    case "stripe":
      return (
        <StripeWrapper paymentSession={paymentSession}>
          {children}
        </StripeWrapper>
      )

    default:
      return <div>{children}</div>
  }
}

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

const StripeWrapper: React.FC<WrapperProps> = ({
  paymentSession,
  children,
}) => {
  const options: StripeElementsOptions = {
    clientSecret: paymentSession!.data.client_secret as string | undefined,
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
