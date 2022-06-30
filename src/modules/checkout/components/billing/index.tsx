import { useAccount } from "@lib/context/account-context"
import useToggleState from "@lib/hooks/use-toggle-state"
import { Address as MedusaAddress, Cart } from "@medusajs/medusa"
import Button from "@modules/common/components/button"
import Checkbox from "@modules/common/components/checkbox"
import Input from "@modules/common/components/input"
import isEqual from "lodash/isEqual"
import { useCart } from "medusa-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import CountrySelect from "../country-select"
import StepContainer from "../step-container"

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

type BillingFormValues = {
  shipping_address?: AddressValues
  billing_address: AddressValues
  email: string
}

type BillingProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

const Billing = ({ cart }: BillingProps) => {
  const [disabled, setDisabled] = useState(true)

  const { state: shipToBilling, toggle } = useToggleState(
    checkForDifferentBilling(cart)
  )

  const { setCart, updateCart } = useCart()
  const { customer } = useAccount()

  const {
    register,
    control,
    getValues,
    reset,
    formState: { errors, touchedFields },
    handleSubmit,
    trigger,
  } = useForm<BillingFormValues>({
    defaultValues: { ...mapBillingInformation(cart) },
  })

  useEffect(() => {
    setDisabled(true)

    if (!cart.email) {
      return
    }

    setDisabled(false)
  }, [cart])

  const submitShipping = handleSubmit((values) => {
    const shippingAddress = { ...values.shipping_address, metadata: {} }
    const payload = {
      shipping_address: shippingAddress,
    }

    // If billing address is the same then we submit the same address
    if (!shipToBilling) {
      Object.assign(payload, { billing_address: shippingAddress })
    }

    updateCart.mutate(payload, {
      onSuccess: ({ cart }) => setCart(cart),
    })
  })

  const submitBilling = handleSubmit(
    (values) => {
      const payload = {
        billing_address: { ...values.billing_address!, metadata: {} },
      }

      updateCart.mutate(payload, {
        onSuccess: ({ cart }) => setCart(cart),
      })
    },
    (err) => console.log(err)
  )

  const handleSubmitShipping = () => {
    trigger().then((isValid) => {
      // If the form is invalid, we abort the submit
      if (!isValid) {
        return
      }

      const currentAddress = mapBillingInformation(cart.shipping_address)
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

      const currentAddress = mapBillingInformation(cart.billing_address)
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
    if (shipToBilling && cart.billing_address && cart.shipping_address) {
      // If the two addresses are already the same, we abort the update
      if (!checkForDifferentBilling(cart)) {
        setShipToBilling(!shipToBilling)
        return
      }

      const newShipping = {
        ...mapBillingInformation(cart).shipping_address,
        metadata: {},
      }

      updateCart.mutate(
        { shipping_address: newShipping },
        {
          onSuccess: ({ cart }) => {
            reset({
              shipping_address: mapBillingInformation(cart).shipping_address,
            })
            setCart(cart)
          },
        }
      )
    }

    setShipToBilling(!shipToBilling)
  }

  const applySavedAddress = (address: MedusaAddress) => {
    const shippingAddress = mapBillingInformation(address)
    const currentAddress = getValues("shipping_address")

    // If the address is the same, we abort the update
    if (isEqual(shippingAddress, currentAddress)) {
      return
    }

    const payload = {
      shipping_address: address.id,
    }

    // If billing address is the same then we submit the same address
    if (!shipToBilling) {
      Object.assign(payload, { billing_address: address.id })
    }

    updateCart.mutate(payload, {
      onSuccess: ({ cart }) => {
        reset({
          ...mapBillingInformation(cart),
        })
        setCart(cart)
      },
    })
  }

  return (
    <StepContainer title="Shipping information" index={1}>
      <form onSubmit={submitBilling} className="px-8 pb-8">
        <div className="grid grid-cols-1 gap-y-2">
          <Input
            label="Email"
            {...register("email", { required: "Email is required" })}
            errors={errors}
            touched={touchedFields}
          />
          <div className="grid grid-cols-2 gap-x-2">
            <Input
              label="First name"
              {...register("billing_address.first_name", {
                required: "First name is required",
              })}
              errors={errors}
              touched={touchedFields}
            />
            <Input
              label="Last name"
              {...register("billing_address.last_name", {
                required: "Last name is required",
              })}
              errors={errors}
              touched={touchedFields}
            />
          </div>
          <Input
            label="Company"
            {...register("billing_address.company")}
            errors={errors}
            touched={touchedFields}
          />
          <Input
            label="Address"
            {...register("billing_address.address_1", {
              required: "Address is required",
            })}
            errors={errors}
            touched={touchedFields}
          />
          <Input
            label="Apartments, suite, etc."
            {...register("billing_address.address_2")}
            errors={errors}
            touched={touchedFields}
          />
          <div className="grid grid-cols-[144px_1fr] gap-x-2">
            <Input
              label="Postal code"
              {...register("billing_address.postal_code", {
                required: "Postal code is required",
              })}
              errors={errors}
              touched={touchedFields}
            />
            <Input
              label="City"
              {...register("billing_address.city", {
                required: "City is required",
              })}
              errors={errors}
              touched={touchedFields}
            />
          </div>
          <CountrySelect
            {...register("billing_address.country_code", {
              required: "Country is required",
            })}
            errors={errors}
            touched={touchedFields}
          />
          <Input
            label="State / Province"
            {...register("billing_address.province")}
            errors={errors}
            touched={touchedFields}
          />
          <Input
            label="Phone"
            {...register("billing_address.phone")}
            errors={errors}
            touched={touchedFields}
          />
        </div>
        <div className="mt-6">
          <Checkbox
            label="Ship to billing address"
            checked={shipToBilling}
            onChange={toggle}
          />
        </div>
        {!shipToBilling && (
          <div className="pt-8 pb-2">
            <div className="text-large-semi flex items-center gap-x-4">
              <div className="bg-gray-900 w-8 h-8 rounded-full text-white flex justify-center items-center font-mono text-sm">
                {2}
              </div>
              <h2>Shipping address</h2>
            </div>
            <div className="grid grid-cols-1 gap-y-2 pt-6">
              <div className="grid grid-cols-2 gap-x-2">
                <Input
                  label="First name"
                  {...register("shipping_address.first_name", {
                    required: "First name is required",
                  })}
                  errors={errors}
                  touched={touchedFields}
                />
                <Input
                  label="Last name"
                  {...register("shipping_address.last_name", {
                    required: "Last name is required",
                  })}
                  errors={errors}
                  touched={touchedFields}
                />
              </div>
              <Input
                label="Company"
                {...register("shipping_address.company")}
                errors={errors}
                touched={touchedFields}
              />
              <Input
                label="Address"
                {...register("shipping_address.address_1", {
                  required: "Address is required",
                })}
                errors={errors}
                touched={touchedFields}
              />
              <Input
                label="Apartments, suite, etc."
                {...register("shipping_address.address_2")}
                errors={errors}
                touched={touchedFields}
              />
              <div className="grid grid-cols-[122px_1fr] gap-x-2">
                <Input
                  label="Postal code"
                  {...register("shipping_address.postal_code", {
                    required: "Postal code is required",
                  })}
                  errors={errors}
                  touched={touchedFields}
                />
                <Input
                  label="City"
                  {...register("shipping_address.city", {
                    required: "City is required",
                  })}
                  errors={errors}
                  touched={touchedFields}
                />
              </div>
              <CountrySelect
                {...register("shipping_address.country_code", {
                  required: "Country is required",
                })}
                errors={errors}
                touched={touchedFields}
              />
              <Input
                label="State / Province"
                {...register("shipping_address.province")}
                errors={errors}
                touched={touchedFields}
              />
              <Input
                label="Phone"
                {...register("billing_address.phone")}
                errors={errors}
                touched={touchedFields}
              />
            </div>
          </div>
        )}
        <div className="mt-6">
          <Button className="max-w-[200px]">Continue to shipping</Button>
        </div>
      </form>
    </StepContainer>
  )
}

const mapBillingInformation = (
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
) => {
  const billingAddress = cart.billing_address
  const shippingAddress = cart.shipping_address

  return {
    shipping_address: {
      first_name: shippingAddress?.first_name || "",
      last_name: shippingAddress?.last_name || "",
      company: shippingAddress?.company || "",
      address_1: shippingAddress?.address_1 || "",
      address_2: shippingAddress?.address_2 || "",
      city: shippingAddress?.city || "",
      province: shippingAddress?.province || "",
      postal_code: shippingAddress?.postal_code || "",
      country_code: shippingAddress?.country_code || "",
      phone: shippingAddress?.phone || "",
    },
    billing_address: {
      first_name: billingAddress?.first_name || "",
      last_name: billingAddress?.last_name || "",
      company: billingAddress?.company || "",
      address_1: billingAddress?.address_1 || "",
      address_2: billingAddress?.address_2 || "",
      city: billingAddress?.city || "",
      province: billingAddress?.province || "",
      postal_code: billingAddress?.postal_code || "",
      country_code: billingAddress?.country_code || "",
      phone: billingAddress?.phone || "",
    },
    email: cart.email,
  }
}

const checkForDifferentBilling = (
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
) => {
  if (!cart.shipping_address) {
    return true
  }

  const { billing_address, shipping_address } = mapBillingInformation(cart)

  return isEqual(billing_address, shipping_address)
}

export default Billing
