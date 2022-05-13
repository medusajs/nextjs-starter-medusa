import { useCheckout } from "@lib/context/checkout-context"
import { PaymentSession } from "@medusajs/medusa"
import Spinner from "@modules/common/icons/spinner"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js"
import clsx from "clsx"
import React, { useEffect, useState } from "react"
import PaymentButton from "../payment-button"
import PaymentContainer from "../payment-container"

const Payment = () => {
  const [disabled, setDisabled] = useState(true)
  const { cart, setPaymentSession } = useCheckout()

  useEffect(() => {
    setDisabled(true)

    if (!cart) {
      return
    }

    if (!cart.shipping_address) {
      return
    }

    if (!cart.billing_address) {
      return
    }

    if (!cart.email) {
      return
    }

    if (cart.shipping_methods.length < 1) {
      return
    }

    setDisabled(false)
  }, [cart])

  return (
    <Wrapper paymentSession={cart?.payment_session}>
      <div className="flex flex-col gap-y-16">
        <div>
          <h3 className="mb-6 text-xl-semi">Payment</h3>
          <div
            className={clsx("border border-gray-200", {
              "opacity-50 pointer-events-none": disabled,
            })}
          >
            {cart?.payment_sessions?.length ? (
              cart.payment_sessions
                .sort((a, b) => {
                  return a.provider_id > b.provider_id ? 1 : -1
                })
                .map((paymentSession) => {
                  return (
                    <PaymentContainer
                      disabled={disabled}
                      paymentSession={paymentSession}
                      key={paymentSession.id}
                      selected={
                        cart?.payment_session?.provider_id ===
                        paymentSession.provider_id
                      }
                      setSelected={() =>
                        setPaymentSession(paymentSession.provider_id)
                      }
                    />
                  )
                })
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-8 text-gray-900">
                <Spinner />
              </div>
            )}
          </div>
        </div>

        <PaymentButton paymentSession={cart?.payment_session} />
      </div>
    </Wrapper>
  )
}

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

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || "")

const StripeWrapper: React.FC<WrapperProps> = ({
  paymentSession,
  children,
}) => {
  const options: StripeElementsOptions = {
    clientSecret: paymentSession!.data.client_secret,
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}

export default Payment
