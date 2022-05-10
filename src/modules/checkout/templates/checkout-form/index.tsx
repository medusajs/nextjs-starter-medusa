import { useCheckout } from "@lib/context/checkout-context"
import Address from "@modules/checkout/components/address"
import Email from "@modules/checkout/components/email"
import Payment from "@modules/checkout/components/payment"
import ShippingRadioGroup from "@modules/checkout/components/shipping-radio-group"
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
    initializeCheckout,
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
        <Email />

        <Address />

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

        <Payment />
      </div>
    </div>
  )
}

export default CheckoutForm
