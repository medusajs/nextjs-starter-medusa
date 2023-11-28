import { useCheckout } from "@lib/context/checkout-context"
import PaymentContainer from "../payment-container"
import { Button, Container, Heading, Text, Tooltip, clx } from "@medusajs/ui"
import { RadioGroup } from "@headlessui/react"
import PaymentStripe from "../payment-stripe"
import Divider from "@modules/common/components/divider"
import { useForm } from "react-hook-form"
import { useCart, useSetPaymentSession } from "medusa-react"
import { ErrorMessage } from "@hookform/error-message"
import { CreditCard, CheckCircleSolid } from "@medusajs/icons"
import Spinner from "@modules/common/icons/spinner"
import Ideal from "@modules/common/icons/ideal"
import Bancontact from "@modules/common/icons/bancontact"
import { useElements } from "@stripe/react-stripe-js"
import { useState } from "react"

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: JSX.Element }
> = {
  stripe: {
    title: "Credit card",
    icon: <CreditCard />,
  },
  "stripe-ideal": {
    title: "iDeal",
    icon: <Ideal />,
  },
  "stripe-bancontact": {
    title: "Bancontact",
    icon: <Bancontact />,
  },
  manual: {
    title: "Test payment",
    icon: <CreditCard />,
  },
  // Add more payment providers here
}

const Payment = () => {
  const {
    cart,
    editPayment: { state: isOpen, open, close },
    editAddresses: { state: addressesIsOpen, close: closeAddresses },
    editShipping: { state: shippingIsOpen, close: closeShipping },
    addressReady,
    shippingReady,
    paymentReady,
  } = useCheckout()

  const { setCart } = useCart()

  const [cardFormState, setCardFormState] = useState({
    cardNumberComplete: false,
    cardExpiryComplete: false,
    cardCvcComplete: false,
  })

  const { cardNumberComplete, cardExpiryComplete, cardCvcComplete } =
    cardFormState

  const cardFormComplete =
    cardNumberComplete && cardExpiryComplete && cardCvcComplete

  const {
    mutate: setPaymentSessionMutation,
    isLoading: settingPaymentSession,
  } = useSetPaymentSession(cart?.id!)

  const handleEdit = () => {
    open()
    closeAddresses()
    closeShipping()
  }

  const editingOtherSteps = addressesIsOpen || shippingIsOpen

  const handleSubmit = () => {
    close()
  }

  const handleChange = (value: string) => {
    setPaymentSession(value)
    clearErrors("paymentSession")
  }

  const useFormState = useForm({ mode: "onChange", reValidateMode: "onChange" })

  const {
    setError,
    formState: { errors, isValid },
    clearErrors,
  } = useFormState

  const setPaymentSession = (providerId: string) => {
    if (cart) {
      setPaymentSessionMutation(
        {
          provider_id: providerId,
        },
        {
          onSuccess: ({ cart }) => {
            setCart(cart)
          },
          onError: () =>
            setError(
              "paymentSession",
              {
                type: "validate",
                message:
                  "An error occurred while selecting this payment method. Please try again.",
              },
              { shouldFocus: true }
            ),
        }
      )
    }
  }

  return (
    <div className="bg-white px-4 small:px-8">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          Payment
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && addressReady && shippingReady && (
          <Text>
            <button onClick={handleEdit} className="text-ui-fg-interactive">
              Edit
            </button>
          </Text>
        )}
      </div>
      <div>
        {cart?.payment_sessions?.length ? (
          <div className={!editingOtherSteps && isOpen ? "block" : "hidden"}>
            <RadioGroup
              value={cart.payment_session?.provider_id || ""}
              onChange={(value: string) => handleChange(value)}
            >
              {cart.payment_sessions
                .sort((a, b) => {
                  return a.provider_id > b.provider_id ? 1 : -1
                })
                .map((paymentSession) => {
                  return (
                    <PaymentContainer
                      paymentInfoMap={paymentInfoMap}
                      paymentSession={paymentSession}
                      key={paymentSession.id}
                      selectedPaymentOptionId={
                        cart.payment_session?.provider_id || null
                      }
                    />
                  )
                })}
            </RadioGroup>
            <ErrorMessage
              errors={errors}
              name="paymentSession"
              render={({ message }) => {
                return (
                  <div className="pt-2 text-rose-500 text-small-regular">
                    <span>{message}</span>
                  </div>
                )
              }}
            />
            {cart.payment_session?.provider_id === "stripe" && (
              <div className="pt-8">
                <PaymentStripe
                  useFormState={useFormState}
                  setState={setCardFormState}
                  state={cardFormState}
                />
              </div>
            )}
            <Button
              onClick={handleSubmit}
              type="submit"
              size="large"
              className="mt-6"
              disabled={
                !cart.payment_session?.provider_id ||
                (cart.payment_session?.provider_id === "stripe" &&
                  !cardFormComplete)
              }
              isLoading={settingPaymentSession}
            >
              Continue to review
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-gray-900">
            <Spinner />
          </div>
        )}

        <div className={!editingOtherSteps && isOpen ? "hidden" : "block"}>
          {cart && cart.payment_session && (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment method
                </Text>
                <Text className="txt-medium text-ui-fg-subtle">
                  {paymentInfoMap[cart.payment_session.provider_id]?.title ||
                    cart.payment_session.provider_id}
                </Text>
                {process.env.NODE_ENV === "development" &&
                  !Object.hasOwn(
                    paymentInfoMap,
                    cart.payment_session.provider_id
                  ) && (
                    <Tooltip content="You can add a user-friendly name and icon for this payment provider in 'src/modules/checkout/components/payment/index.tsx'" />
                  )}
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment details
                </Text>
                <div className="flex gap-2 txt-medium text-ui-fg-subtle items-center">
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[cart.payment_session.provider_id]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>
                    {cart.payment_session.provider_id === "stripe"
                      ? "**** **** **** ****"
                      : "Another step will appear"}
                  </Text>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment
