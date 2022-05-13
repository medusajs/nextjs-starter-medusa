import { useCheckout } from "@lib/context/checkout-context"
import Spinner from "@modules/common/icons/spinner"
import clsx from "clsx"
import React, { useEffect, useState } from "react"
import GiftCard from "../gift-card"
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
    <div className="p-10 bg-white">
      <div>
        <h3 className="mb-2 text-xl-semi">Payment</h3>
        <div className="mb-4">
          <span className="text-base-regular text-gray-700">
            How would you like to pay?
          </span>
        </div>
        <GiftCard cart={cart} />
        <div
          className={clsx({
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
    </div>
  )
}

export default Payment
