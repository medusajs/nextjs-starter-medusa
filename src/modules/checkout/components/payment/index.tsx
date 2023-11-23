import { useCheckout } from "@lib/context/checkout-context"
import Spinner from "@modules/common/icons/spinner"
import { useEffect } from "react"
import PaymentContainer from "../payment-container"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import { RadioGroup } from "@headlessui/react"
import PaymentStripe from "../payment-stripe"
import Divider from "@modules/common/components/divider"
import { useForm } from "react-hook-form"
import { useCart, useSetPaymentSession } from "medusa-react"
import { ErrorMessage } from "@hookform/error-message"
import { Apple, CreditCard, CheckCircleSolid } from "@medusajs/icons"
import Ideal from "@modules/common/icons/ideal"
import Bancontact from "@modules/common/icons/bancontact"

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
}

const Payment = () => {
  const {
    cart,
    initPayment,
    editPayment: { state: isOpen, toggle, open, close },
    editAddresses: {
      state: addressesIsOpen,
      toggle: toggleAddresses,
      open: openAddresses,
      close: closeAddresses,
    },
    editShipping: {
      state: shippingIsOpen,
      toggle: toggleShipping,
      open: openShipping,
      close: closeShipping,
    },
    addressReady,
    shippingReady,
    paymentReady,
    selectedPaymentOptionId,
    setSelectedPaymentOptionId,
  } = useCheckout()

  const { setCart } = useCart()

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
    if (!selectedPaymentOptionId) {
      return
    }
    setPaymentSession(selectedPaymentOptionId!)
    close()
  }

  const {
    setError,
    formState: { errors },
  } = useForm()

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

  /**
   * Fallback if the payment session are not loaded properly we
   * retry to load them after a 5 second delay.
   */
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null

    if (cart?.shipping_address && cart?.payment_sessions) {
      timeout = setTimeout(() => {
        initPayment()
      }, 5000)
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart])

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
        {!editingOtherSteps && isOpen ? (
          cart?.payment_sessions?.length ? (
            <>
              <RadioGroup
                value={selectedPaymentOptionId}
                onChange={(value: string) => setSelectedPaymentOptionId(value)}
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
                        selectedPaymentOptionId={selectedPaymentOptionId}
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
              {selectedPaymentOptionId === "stripe" && (
                <div className="pt-8 pr-7">
                  <PaymentStripe />
                </div>
              )}
              <Button
                onClick={handleSubmit}
                type="submit"
                size="large"
                className="mt-6"
                disabled={!selectedPaymentOptionId}
                isLoading={settingPaymentSession}
              >
                Continue to preview
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-16 text-gray-900">
              <Spinner />
            </div>
          )
        ) : (
          <div>
            {cart && cart.payment_session && (
              <div className="flex items-start gap-x-1 w-full">
                <div className="flex flex-col w-1/3">
                  <Text className="txt-medium-plus text-ui-fg-base mb-1">
                    Payment method
                  </Text>
                  <Text className="txt-medium text-ui-fg-subtle">
                    {paymentInfoMap[cart.payment_session.provider_id].title}
                  </Text>
                </div>
                <div className="flex flex-col w-1/3">
                  <Text className="txt-medium-plus text-ui-fg-base mb-1">
                    Payment details
                  </Text>
                  <div className="flex gap-2 txt-medium text-ui-fg-subtle items-center">
                    <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                      {paymentInfoMap[cart.payment_session.provider_id].icon}
                    </Container>
                    <Text>
                      {cart.payment_session.provider_id === "stripe"
                        ? `**** **** **** ${cart.payment_session.data.card_last4}`
                        : "Another step will appear"}
                    </Text>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment
