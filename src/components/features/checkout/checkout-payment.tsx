"use client"

import { Fragment, useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { CircleCheckIcon, CreditCardIcon } from "lucide-react"

import { paymentInfoMap } from "@/constants/data"
import { isStripe as isStripeFunc } from "@/lib/type-guard"
import { initiatePaymentSession } from "@/utils/data/cart"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/primitives/button"
import { Section } from "@/components/ui/react/design-system"
import { Separator } from "@/components/ui/primitives/separator"
import { ErrorMessage } from "@/components/ui/forms/error-message"
import {
  PaymentContainer,
  StripeCardContainer,
} from "@/components/features/checkout/payment-container"
import { RadioGroup } from "@/components/ui/primitives/radio-group"

type Props = {
  cart: any
  availablePaymentMethods: any[]
}

function Payment({ cart, availablePaymentMethods }: Props) {
  const t = useTranslations("features.checkout.payment")

  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const isStripe = isStripeFunc(selectedPaymentMethod)

  console.log(selectedPaymentMethod)

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (isStripeFunc(method)) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputCard =
        isStripeFunc(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputCard) {
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          {
            scroll: false,
          }
        )
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-background">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2
          className={cn(
            "flex text-xl lg:text-2xl font-medium gap-x-2 items-center",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          3. {t("summary.title")}
          {!isOpen && paymentReady && (
            <CircleCheckIcon className="size-5 mt-0.5" />
          )}
        </h2>
        {!isOpen && paymentReady && (
          <p>
            <Button
              onClick={handleEdit}
              variant="secondary"
              data-testid="edit-payment-button"
            >
              {t("button.edit")}
            </Button>
          </p>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && availablePaymentMethods?.length && (
            <Fragment>
              <RadioGroup
                value={selectedPaymentMethod}
                onValueChange={(value: string) => setPaymentMethod(value)}
              >
                {availablePaymentMethods.map((paymentMethod) => (
                  <div key={paymentMethod.id}>
                    {isStripeFunc(paymentMethod.id) ? (
                      <StripeCardContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        paymentInfoMap={paymentInfoMap}
                        setCardBrand={setCardBrand}
                        setError={setError}
                        setCardComplete={setCardComplete}
                      />
                    ) : (
                      <PaymentContainer
                        paymentInfoMap={paymentInfoMap}
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                      />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </Fragment>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <p className="font-medium text-foreground mb-1">
                {t("label.payment_method")}
              </p>
              <p
                className="font-medium text-foreground"
                data-testid="payment-method-summary"
              >
                {t("label.gift_card")}
              </p>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <Button
            size="lg"
            className="mt-6"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={
              (isStripe && !cardComplete) ||
              (!selectedPaymentMethod && !paidByGiftcard)
            }
            data-testid="submit-payment-button"
          >
            {!activeSession && isStripeFunc(selectedPaymentMethod)
              ? t("button.enter_card_details")
              : t("button.continue")}
          </Button>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <p className="font-medium text-foreground mb-1">
                  {t("label.payment_method")}
                </p>
                <p
                  className="font-medium text-foreground"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </p>
              </div>
              <div className="flex flex-col w-1/3">
                <p className="font-medium text-foreground mb-1">
                  {t("label.payment_details")}
                </p>
                <div
                  className="flex gap-2 font-medium text-foreground items-center"
                  data-testid="payment-details-summary"
                >
                  <Section className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCardIcon />
                    )}
                  </Section>
                  <p>
                    {isStripeFunc(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : "Another step will appear"}
                  </p>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <p className="font-medium text-foreground mb-1">
                {t("label.payment_method")}
              </p>
              <p
                className="font-medium text-foreground"
                data-testid="payment-method-summary"
              >
                {t("label.gift_card")}
              </p>
            </div>
          ) : null}
        </div>
      </div>
      <Separator className="mt-8" />
    </div>
  )
}

export { Payment }
export type { Props as PaymentProps }
