import { PaymentSession } from "@medusajs/medusa"
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
} from "@stripe/react-stripe-js"
import {
  loadStripe,
  StripeCardCvcElementOptions,
  StripeCardExpiryElementOptions,
  StripeCardNumberElementOptions,
  StripeElementsOptions,
} from "@stripe/stripe-js"
import React, { useMemo } from "react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || "")

type PaymentStripeProps = {
  paymentSession: PaymentSession
}

const PaymentStripe: React.FC<PaymentStripeProps> = ({ paymentSession }) => {
  const options: StripeElementsOptions = {
    clientSecret: paymentSession.data.client_secret,
  }

  const useOptions:
    | StripeCardNumberElementOptions
    | StripeCardExpiryElementOptions
    | StripeCardCvcElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: "Inter, sans-serif",
          color: "#424270",
          padding: "10px 12px",
          "::placeholder": {
            color: "#CFD7E0",
          },
        },
      },
    }
  }, [])

  return (
    <div>
      <Elements stripe={stripePromise} options={options}>
        <div className="flex flex-col relative w-full">
          <CardNumber options={useOptions as StripeCardNumberElementOptions} />
          <div className="flex items-center mt-12 relative gap-x-4">
            <CardExpiry
              options={useOptions as StripeCardExpiryElementOptions}
            />
            <CardCVC options={useOptions as StripeCardCvcElementOptions} />
          </div>
        </div>
      </Elements>
    </div>
  )
}

const CardNumber = ({
  options,
}: {
  options: StripeCardNumberElementOptions
}) => {
  return (
    <div className="border-b border-gray-200 border-dashed py-2 relative">
      <span className="absolute -top-6 text-gray-700 text-base-regular">
        Card number
      </span>
      <CardNumberElement options={options} />
    </div>
  )
}

const CardExpiry = ({
  options,
}: {
  options: StripeCardExpiryElementOptions
}) => {
  return (
    <div className="border-b border-gray-200 border-dashed w-full py-2 relative">
      <span className="absolute -top-6 text-gray-700 text-base-regular">
        Expiration date
      </span>
      <CardExpiryElement options={options} />
    </div>
  )
}

const CardCVC = ({ options }: { options: StripeCardCvcElementOptions }) => {
  return (
    <div className="border-b border-gray-200 border-dashed w-full py-2 relative">
      <span className="absolute -top-6 text-gray-700 text-base-regular">
        CVC
      </span>
      <CardCvcElement options={{ ...options, placeholder: "123" }} />
    </div>
  )
}

export default PaymentStripe
