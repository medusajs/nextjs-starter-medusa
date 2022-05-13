import { useAccount } from "@lib/context/account-context"
import { Address as MedusaAddress, Cart } from "@medusajs/medusa"
import AddAddress from "@modules/account/components/address-card/add-address"
import EditAddress from "@modules/account/components/address-card/edit-address-modal"
import Checkbox from "@modules/common/components/checkbox"
import Input from "@modules/common/components/input"
import clsx from "clsx"
import isEqual from "lodash/isEqual"
import { useCart } from "medusa-react"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import CountrySelect from "../country-select"

type AddressValues = {
  first_name: string
  last_name: string
  company: string
  address_1: string
  address_2: string
  city: string
  province: string
  postal_code: string
  country_code: string
  phone: string
}

type AddressFormValues = {
  shipping_address: AddressValues
  billing_address?: AddressValues
}

type AddressProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

const Address: React.FC<AddressProps> = ({ cart }) => {
  const [disabled] = useState(!cart.email)
  const [differentBilling, setDifferentBilling] = useState(
    checkForDifferentBilling(cart)
  )

  const { setCart, updateCart } = useCart()
  const { customer } = useAccount()

  const {
    register,
    control,
    getValues,
    reset,
    formState: { errors },
    handleSubmit,
    trigger,
  } = useForm<AddressFormValues>({
    defaultValues: {
      shipping_address: mapAddressToValues(cart.shipping_address),
      billing_address: mapAddressToValues(cart.billing_address),
    },
  })

  const submitShipping = handleSubmit((values) => {
    const shippingAddress = { ...values.shipping_address, metadata: {} }
    const payload = {
      shipping_address: shippingAddress,
    }

    // If billing address is the same then we submit the same address
    if (!differentBilling) {
      Object.assign(payload, { billing_address: shippingAddress })
    }

    updateCart.mutate(payload, {
      onSuccess: ({ cart }) => setCart(cart),
    })
  })

  const submitBilling = handleSubmit((values) => {
    const payload = {
      billing_address: { ...values.billing_address!, metadata: {} },
    }

    updateCart.mutate(payload, {
      onSuccess: ({ cart }) => setCart(cart),
    })
  })

  const handleSubmitShipping = () => {
    trigger().then((isValid) => {
      // If the form is invalid, we abort the submit
      if (!isValid) {
        return
      }

      const currentAddress = mapAddressToValues(cart.shipping_address)
      const newAddress = getValues("shipping_address")

      // If the address is the same, we abort the submit
      if (isEqual(currentAddress, newAddress)) {
        return
      }

      // Otherwise, we submit the form
      submitShipping()
    })
  }

  const handleSubmitBilling = () => {
    trigger().then((isValid) => {
      // If the form is invalid, we abort the submit
      if (!isValid) {
        return
      }

      const currentAddress = mapAddressToValues(cart.billing_address)
      const newAddress = getValues("billing_address")

      // If the address is the same, we abort the submit
      if (isEqual(currentAddress, newAddress)) {
        return
      }

      // Otherwise, we submit the form
      submitBilling()
    })
  }

  const handleChangeDifferentBilling = () => {
    // If differentBilling is unchecked, and billing address and shipping address are set,
    // then we need to update the billing address to the shipping address.
    if (differentBilling && cart.billing_address && cart.shipping_address) {
      // If the two addresses are already the same, we abort the update
      if (!checkForDifferentBilling(cart)) {
        setDifferentBilling(!differentBilling)
        return
      }

      const newBilling = {
        ...mapAddressToValues(cart.shipping_address),
        metadata: {},
      }

      updateCart.mutate(
        { billing_address: newBilling },
        {
          onSuccess: ({ cart }) => {
            reset({ billing_address: mapAddressToValues(cart.billing_address) })
            setCart(cart)
          },
        }
      )
    }

    setDifferentBilling(!differentBilling)
  }

  const applySavedAddress = (address: MedusaAddress) => {
    const shippingAddress = mapAddressToValues(address)
    const currentAddress = getValues("shipping_address")

    // If the address is the same, we abort the update
    if (isEqual(shippingAddress, currentAddress)) {
      return
    }

    const payload = {
      shipping_address: address.id,
    }

    // If billing address is the same then we submit the same address
    if (!differentBilling) {
      Object.assign(payload, { billing_address: address.id })
    }

    updateCart.mutate(payload, {
      onSuccess: ({ cart }) => {
        reset({
          billing_address: shippingAddress,
          shipping_address: shippingAddress,
        })
        setCart(cart)
      },
    })
  }

  return (
    <div
      className={clsx("w-full lg:max-w-2xl flex flex-col gap-y-16", {
        "opacity-75 pointer-events-none ": disabled,
      })}
    >
      <div className="flex flex-col">
        <h3 className="mb-6 text-xl-semi">Delivery address</h3>
        {customer ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
            {customer.shipping_addresses.map((address) => {
              return (
                <div
                  key={address.id}
                  onClick={() => applySavedAddress(address)}
                  className="cursor-pointer"
                >
                  <EditAddress
                    address={address}
                    isActive={cart.shipping_address?.id === address.id}
                  />
                </div>
              )
            })}
            <AddAddress />
          </div>
        ) : (
          <form onBlur={handleSubmitShipping}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <Input
                label="First name"
                {...register("shipping_address.first_name", {
                  required: "First name is required",
                })}
                disabled={disabled}
                errors={errors}
              />
              <Input
                label="Last name"
                {...register("shipping_address.last_name", {
                  required: "Last name is required",
                })}
                disabled={disabled}
                errors={errors}
              />
              <div className="col-span-full">
                <Input
                  label="Company"
                  {...register("shipping_address.company")}
                  disabled={disabled}
                  errors={errors}
                />
              </div>
              <div className="col-span-full">
                <Input
                  label="Address"
                  {...register("shipping_address.address_1", {
                    required: "Address is required",
                  })}
                  disabled={disabled}
                  errors={errors}
                />
              </div>
              <div className="col-span-full">
                <Input
                  label="Apartments, suite, etc."
                  {...register("shipping_address.address_2")}
                  disabled={disabled}
                  errors={errors}
                />
              </div>
              <Input
                label="Postal code"
                {...register("shipping_address.postal_code", {
                  required: "Postal code is required",
                })}
                disabled={disabled}
                errors={errors}
              />
              <Input
                label="City"
                {...register("shipping_address.city", {
                  required: "City is required",
                })}
                disabled={disabled}
                errors={errors}
              />
              <Input
                label="Province"
                {...register("shipping_address.province")}
                disabled={disabled}
                errors={errors}
              />
              <Controller
                name="shipping_address.country_code"
                control={control}
                rules={{ required: "Country is required" }}
                render={({ field: { onChange, value } }) => {
                  return (
                    <CountrySelect
                      onChange={onChange}
                      value={value}
                      errors={errors}
                      disabled={disabled}
                      name={"shipping_address.country_code"}
                    />
                  )
                }}
              />
              <div className="col-span-full">
                <Input
                  label="Phone"
                  {...register("shipping_address.phone")}
                  disabled={disabled}
                  errors={errors}
                />
              </div>
            </div>
          </form>
        )}
        <div className="mt-2">
          <Checkbox
            label="Use a different billing address"
            checked={differentBilling}
            onChange={handleChangeDifferentBilling}
          />
        </div>
      </div>

      {differentBilling && (
        <div className="flex flex-col">
          <h3 className="mb-6 text-xl-semi">Billing address</h3>
          <form onBlur={handleSubmitBilling}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <Input
                label="First name"
                {...register("billing_address.first_name", {
                  required: "First name is required",
                })}
                disabled={disabled}
                errors={errors}
              />
              <Input
                label="Last name"
                {...register("billing_address.last_name", {
                  required: "Last name is required",
                })}
                disabled={disabled}
                errors={errors}
              />
              <div className="col-span-full">
                <Input
                  label="Company"
                  {...register("billing_address.company")}
                  disabled={disabled}
                  errors={errors}
                />
              </div>
              <div className="col-span-full">
                <Input
                  label="Address"
                  {...register("billing_address.address_1", {
                    required: "Address is required",
                  })}
                  disabled={disabled}
                  errors={errors}
                />
              </div>
              <div className="col-span-full">
                <Input
                  label="Apartments, suite, etc."
                  {...register("billing_address.address_2")}
                  disabled={disabled}
                  errors={errors}
                />
              </div>
              <Input
                label="Postal code"
                {...register("billing_address.postal_code", {
                  required: "Postal code is required",
                })}
                disabled={disabled}
                errors={errors}
              />
              <Input
                label="City"
                {...register("billing_address.city", {
                  required: "City is required",
                })}
                disabled={disabled}
                errors={errors}
              />
              <Input
                label="Province"
                {...register("billing_address.province")}
                disabled={disabled}
                errors={errors}
              />
              <Controller
                name="billing_address.country_code"
                control={control}
                rules={{ required: "Country is required" }}
                render={({ field: { onChange, value } }) => {
                  return (
                    <CountrySelect
                      onChange={onChange}
                      value={value}
                      errors={errors}
                      disabled={disabled}
                      name={"shipping_address.country_code"}
                    />
                  )
                }}
              />
              <div className="col-span-full">
                <Input
                  label="Phone"
                  {...register("billing_address.phone")}
                  disabled={disabled}
                  errors={errors}
                />
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

const mapAddressToValues = (address: MedusaAddress | null): AddressValues => {
  return {
    first_name: address?.first_name || "",
    last_name: address?.last_name || "",
    company: address?.company || "",
    address_1: address?.address_1 || "",
    address_2: address?.address_2 || "",
    city: address?.city || "",
    province: address?.province || "",
    postal_code: address?.postal_code || "",
    country_code: address?.country_code || "",
    phone: address?.phone || "",
  }
}

const checkForDifferentBilling = (
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
) => {
  if (!cart.billing_address) {
    return false
  }

  const billing = mapAddressToValues(cart.billing_address)
  const shipping = mapAddressToValues(cart.shipping_address)

  return !isEqual(billing, shipping)
}

export default Address
