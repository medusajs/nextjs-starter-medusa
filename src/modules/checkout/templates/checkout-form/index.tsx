import { useCheckout } from "@lib/context/checkout-context"
import CountrySelect from "@modules/checkout/components/country-select"
import PaymentButton from "@modules/checkout/components/payment-button"
import PaymentContainer from "@modules/checkout/components/payment-container"
import ShippingRadioGroup from "@modules/checkout/components/shipping-radio-group"
import Input from "@modules/common/components/input"
import Spinner from "@modules/common/icons/spinner"
import React, { useEffect, useState } from "react"
import { Controller } from "react-hook-form"

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const CheckoutForm = () => {
  const {
    register,
    watch,
    formState: { errors },
    billingAddressEnabled,
    shippingMethods,
    cart,
    initializeCheckout,
    setPaymentSession,
  } = useCheckout()

  const [showInit, setShowInit] = useState(false)

  const email = watch("email")

  useEffect(() => {
    const isValid = validateEmail(email)

    if (isValid) {
      setShowInit(true)
    } else {
      setShowInit(false)
    }
  }, [email])

  return (
    <div className="w-full flex justify-center lg:border-r lg:border-gray-200 lg:py-8">
      <div className="w-full lg:max-w-2xl px-4 py-8 lg:p-0 flex flex-col gap-y-16">
        <div className="flex flex-col">
          <h3 className="mb-6 text-xl-semi">Country</h3>
          <Controller
            name="country_code"
            render={({ field: { onChange, value } }) => {
              return <CountrySelect onChange={onChange} value={value} />
            }}
          />
        </div>

        <div className="flex flex-col">
          <h3 className="mb-6 text-xl-semi">Email address</h3>
          <div className="flex items-center gap-x-2">
            <Input label="Email" {...register("email")} errors={errors} />
            {showInit && (
              <button
                className="bg-gray-900 text-white px-4 py-2 text-base-regular uppercase"
                onClick={async () => await initializeCheckout(email)}
              >
                Add
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="mb-6 text-xl-semi">Delivery address</h3>
          <div className="grid grid-cols-2 gap-5">
            <Input
              label="First name"
              {...register("shipping_address.first_name")}
              errors={errors}
            />
            <Input
              label="Last name"
              {...register("shipping_address.last_name")}
              errors={errors}
            />
            <div className="col-span-full">
              <Input
                label="Address"
                {...register("shipping_address.address_1")}
                errors={errors}
              />
            </div>
            <Input
              label="Postal code"
              {...register("shipping_address.postal_code")}
              errors={errors}
            />
            <Input
              label="City"
              {...register("shipping_address.city")}
              errors={errors}
            />
            <div className="col-span-full">
              <Input
                label="Phone"
                {...register("shipping_address.phone")}
                errors={errors}
              />
            </div>
          </div>
        </div>

        {billingAddressEnabled && (
          <div className="flex flex-col">
            <h3 className="mb-6 text-xl-semi">Billing address</h3>
            <div className="grid grid-cols-2 gap-5">
              <Input
                label="First name"
                {...register("billing_address.first_name", {
                  required: "First name is required",
                })}
                errors={errors}
              />
              <Input
                label="Last name"
                {...register("billing_address.last_name", {
                  required: "Last name is required",
                })}
                errors={errors}
              />
              <div className="col-span-full">
                <Input
                  label="Address"
                  {...register("billing_address.address_1", {
                    required: "Address is required",
                  })}
                  errors={errors}
                />
              </div>
              <Input
                label="Postal code"
                {...register("billing_address.postal_code", {
                  required: "Postal code is required",
                })}
                errors={errors}
              />
              <Input
                label="City"
                {...register("billing_address.city", {
                  required: "City is required",
                })}
                errors={errors}
              />
              <div className="col-span-full">
                <Input
                  label="Phone"
                  {...register("billing_address.phone")}
                  errors={errors}
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <h3 className="mb-6 text-xl-semi">Shipping method</h3>
          <Controller
            name="shipping_method"
            render={({ field: { onChange, value } }) => {
              return (
                <ShippingRadioGroup
                  value={value}
                  onChange={onChange}
                  options={shippingMethods}
                />
              )
            }}
          />
        </div>

        <div>
          <h3 className="mb-6 text-xl-semi">Payment</h3>
          <div className="border border-gray-200">
            {cart?.payment_sessions?.length ? (
              cart.payment_sessions.sort((a, b) => {
                return a.provider_id > b.provider_id ? 1 : -1
              }).map((paymentSession) => {
                return (
                  <PaymentContainer
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

        <PaymentButton />
      </div>
    </div>
  )
}

export default CheckoutForm
