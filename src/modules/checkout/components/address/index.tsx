import { useAccount } from "@lib/context/account-context"
import { useCheckout } from "@lib/context/checkout-context"
import AddAddress from "@modules/account/components/address-card/add-address"
import EditAddress from "@modules/account/components/address-card/edit-address-modal"
import Input from "@modules/common/components/input"
import React from "react"
import { Controller } from "react-hook-form"
import CountrySelect from "../country-select"

const Address = () => {
  const {
    register,
    control,
    formState: { errors },
    billingAddressEnabled,
  } = useCheckout()

  const { customer } = useAccount()

  return (
    <div className="w-full lg:max-w-2xl px-4 py-8 lg:p-0 flex flex-col gap-y-16">
      <div className="flex flex-col">
        <h3 className="mb-6 text-xl-semi">Delivery address</h3>
        {customer ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
            {customer.shipping_addresses.map((address) => {
              return (
                <button key={address.id}>
                  <EditAddress address={address} />
                </button>
              )
            })}
            <AddAddress />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First name"
              {...register("shipping_address.first_name", {
                required: "First name is required",
              })}
              errors={errors}
            />
            <Input
              label="Last name"
              {...register("shipping_address.last_name", {
                required: "Last name is required",
              })}
              errors={errors}
            />
            <div className="col-span-full">
              <Input
                label="Address"
                {...register("shipping_address.address_1", {
                  required: "Address is required",
                })}
                errors={errors}
              />
            </div>
            <div className="col-span-full">
              <Input
                label="Apartments, suite, etc."
                {...register("shipping_address.address_2")}
                errors={errors}
              />
            </div>
            <Input
              label="Postal code"
              {...register("shipping_address.postal_code", {
                required: "Postal code is required",
              })}
              errors={errors}
            />
            <Input
              label="City"
              {...register("shipping_address.city", {
                required: "City is required",
              })}
              errors={errors}
            />
            <Input
              label="Province"
              {...register("shipping_address.province")}
              errors={errors}
            />
            <Controller
              name="country_code"
              control={control}
              rules={{ required: "Country is required" }}
              render={({ field: { onChange, value } }) => {
                return (
                  <CountrySelect
                    onChange={onChange}
                    value={value}
                    errors={errors}
                  />
                )
              }}
            />
            <div className="col-span-full">
              <Input
                label="Phone"
                {...register("shipping_address.phone")}
                errors={errors}
              />
            </div>
          </div>
        )}
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
    </div>
  )
}

export default Address
