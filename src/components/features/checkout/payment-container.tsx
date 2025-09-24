"use client"

import React, { useContext, useMemo, type JSX } from "react"

import { isManual } from "@/lib/type-guard"
import { CardElement } from "@stripe/react-stripe-js"
import { StripeCardElementOptions } from "@stripe/stripe-js"
import { cn } from "@/lib/utils"

import { PaymentTest } from "@/components/features/checkout/test/payment-test"
import { StripeContext } from "@/components/features/checkout/wrapper/stripe-wrapper"
import { RadioGroupItem } from "@/components/ui/primitives/radio-group"
import { Label } from "@/components/ui/primitives/label"

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
  children?: React.ReactNode
}

function PaymentContainer({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  children,
}: PaymentContainerProps) {
  const isDevelopment = process.env.NODE_ENV === "development"
  const checked = selectedPaymentOptionId === paymentProviderId

  return (
    <div
      className={cn(
        "flex flex-col gap-y-2 text-sm py-4 border rounded-xl px-6 mb-2 cursor-pointer",
        {
          "border-primary": checked,
          "opacity-50 pointer-events-none": disabled,
        }
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <RadioGroupItem
            value={paymentProviderId}
            id={paymentProviderId}
            checked={checked}
          />
          <Label
            htmlFor={paymentProviderId}
            className="text-base cursor-pointer"
          >
            {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
          </Label>
          {isManual(paymentProviderId) && isDevelopment && (
            <PaymentTest className="hidden lg:block" />
          )}
        </div>
        <span className="justify-self-end text-foreground">
          {paymentInfoMap[paymentProviderId]?.icon}
        </span>
      </div>
      {isManual(paymentProviderId) && isDevelopment && (
        <PaymentTest className="lg:hidden text-[10px]" />
      )}
      {children}
    </div>
  )
}

type StripeCardContainerProps = Omit<PaymentContainerProps, "children"> & {
  setCardBrand: (brand: string) => void
  setError: (error: string | null) => void
  setCardComplete: (complete: boolean) => void
}

const StripeCardContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  setCardBrand,
  setError,
  setCardComplete,
}: StripeCardContainerProps) => {
  const stripeReady = useContext(StripeContext)

  const useOptions: StripeCardElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: "Inter, sans-serif",
          color: "#424270",
          "::placeholder": {
            color: "rgb(107 114 128)",
          },
        },
      },
      classes: {
        base: "pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-cart border rounded-md appearance-none focus:outline-none focus:ring-0 hover:bg-accent hover:text-accent-foregorund transition-all duration-300 ease-in-out",
      },
    }
  }, [])

  const checked = selectedPaymentOptionId === paymentProviderId

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    >
      {checked &&
        (stripeReady ? (
          <div className="my-4 transition-all duration-150 ease-in-out">
            <p className="font-medium text-foreground mb-1">
              Enter your card details:
            </p>
            <CardElement
              options={useOptions as StripeCardElementOptions}
              onChange={(e) => {
                setCardBrand(
                  e.brand && e.brand.charAt(0).toUpperCase() + e.brand.slice(1)
                )
                setError(e.error?.message || null)
                setCardComplete(e.complete)
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1 my-4 transition-all duration-150 ease-in-out">
            <div className="h-4 bg-muted rounded-md w-1/4 animate-pulse mb-1"></div>
            <div className="pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-muted border rounded-md appearance-none animate-pulse" />
          </div>
        ))}
    </PaymentContainer>
  )
}

export { PaymentContainer, StripeCardContainer }
export type { PaymentContainerProps, StripeCardContainerProps }
