import { PaymentSession } from "@medusajs/medusa"
import Button from "@modules/common/components/button"
import Spinner from "@modules/common/icons/spinner"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useEffect, useState } from "react"

type PaymentButtonProps = {
  paymentSession?: PaymentSession | null
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ paymentSession }) => {
  switch (paymentSession?.provider_id) {
    case "stripe":
      return <StripePaymentButton />
    case "manual":
      return <ManualTestPaymentButton />
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

const StripePaymentButton = () => {
  const [disabled, setDisabled] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const stripe = useStripe()
  const elements = useElements()

  useEffect(() => {
    if (!stripe || !elements) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [stripe, elements])

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements) {
      setSubmitting(false)
      return
    }

    stripe.confirmPayment({
      elements: elements,
      confirmParams: {
        return_url: "",
      },
    })
  }

  return (
    <Button disabled={submitting || disabled}>
      {submitting ? <Spinner /> : "Checkout"}
    </Button>
  )
}

const ManualTestPaymentButton: React.FC = () => {
  const [submitting, setSubmitting] = useState(false)

  return (
    <Button disabled={submitting}>
      {submitting ? <Spinner /> : "Checkout"}
    </Button>
  )
}

export default PaymentButton
