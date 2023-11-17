import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
} from "@stripe/react-stripe-js"
import {
  StripeCardCvcElementOptions,
  StripeCardExpiryElementOptions,
  StripeCardNumberElementOptions,
} from "@stripe/stripe-js"
import React, { useMemo } from "react"

const PaymentStripe: React.FC = () => {
  const useOptions:
    | StripeCardNumberElementOptions
    | StripeCardExpiryElementOptions
    | StripeCardCvcElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: "Inter, sans-serif",
          color: "#424270",
          "::placeholder": {
            color: "#CFD7E0",
          },
        },
      },
      classes: {
        base: "pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover",
      },
    }
  }, [])

  return (
    <div className="flex flex-col relative w-full pb-6">
      <CardNumber options={useOptions as StripeCardNumberElementOptions} />
      <div className="flex items-center mt-12 relative gap-x-4">
        <CardExpiry options={useOptions as StripeCardExpiryElementOptions} />
        <CardCVC options={useOptions as StripeCardCvcElementOptions} />
      </div>
    </div>
  )
}

const CardNumber = ({
  options,
}: {
  options: StripeCardNumberElementOptions
}) => {
  return (
    <div className="py-2 relative">
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
    <div className="w-full py-2 relative">
      <span className="absolute -top-6 text-gray-700 text-base-regular">
        Expiration date
      </span>
      <CardExpiryElement options={options} />
    </div>
  )
}

const CardCVC = ({ options }: { options: StripeCardCvcElementOptions }) => {
  return (
    <div className="w-full py-2 relative">
      <span className="absolute -top-6 text-gray-700 text-base-regular">
        CVC
      </span>
      <CardCvcElement options={{ ...options, placeholder: "123" }} />
    </div>
  )
}

export default PaymentStripe
