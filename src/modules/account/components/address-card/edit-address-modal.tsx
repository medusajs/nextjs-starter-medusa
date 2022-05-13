import { medusaClient } from "@lib/config"
import { useAccount } from "@lib/context/account-context"
import useToggleState from "@lib/hooks/use-toggle-state"
import { Address } from "@medusajs/medusa"
import CountrySelect from "@modules/checkout/components/country-select"
import Button from "@modules/common/components/button"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import Spinner from "@modules/common/icons/spinner"
import clsx from "clsx"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"

type FormValues = {
  first_name: string
  last_name: string
  city: string
  country_code: string
  postal_code: string
  province?: string
  address_1: string
  address_2?: string
  phone?: string
  company?: string
}

type EditAddressProps = {
  address: Address
  isActive?: boolean
}

const EditAddress: React.FC<EditAddressProps> = ({
  address,
  isActive = false,
}) => {
  const { state, open, close } = useToggleState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const { refetchCustomer } = useAccount()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      first_name: address.first_name || undefined,
      last_name: address.last_name || undefined,
      city: address.city || undefined,
      address_1: address.address_1 || undefined,
      address_2: address.address_2 || undefined,
      country_code: address.country_code || undefined,
      postal_code: address.postal_code || undefined,
      phone: address.phone || undefined,
      company: address.company || undefined,
      province: address.province || undefined,
    },
  })

  const submit = handleSubmit(async (data: FormValues) => {
    setSubmitting(true)
    setError(undefined)

    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      company: data.company || "Personal",
      address_1: data.address_1,
      address_2: data.address_2 || "",
      city: data.city,
      country_code: data.country_code,
      province: data.province || "",
      postal_code: data.postal_code,
      phone: data.phone || "None",
      metadata: {},
    }

    medusaClient.customers.addresses
      .updateAddress(address.id, payload)
      .then(() => {
        setSubmitting(false)
        refetchCustomer()
        close()
      })
      .catch(() => {
        setSubmitting(false)
        setError("Failed to update address, please try again.")
      })
  })

  const removeAddress = () => {
    medusaClient.customers.addresses.deleteAddress(address.id).then(() => {
      refetchCustomer()
    })
  }

  return (
    <>
      <div
        className={clsx(
          "border border-gray-200 p-5 min-h-[220px] h-full w-full flex flex-col justify-between transition-colors",
          {
            "border-gray-900": isActive,
          }
        )}
      >
        <div className="flex flex-col">
          <span className="text-left text-base-semi">
            {address.first_name} {address.last_name}
          </span>
          {address.company && (
            <span className="text-small-regular text-gray-700">
              {address.company}
            </span>
          )}
          <div className="flex flex-col text-left text-base-regular mt-2">
            <span>
              {address.address_1}
              {address.address_2 && <span>, {address.address_2}</span>}
            </span>
            <span>
              {address.postal_code}, {address.city}
            </span>
            <span>
              {address.province && `${address.province}, `}
              {address.country_code?.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <button
            className="text-small-regular text-gray-700 underline"
            onClick={open}
          >
            Edit
          </button>
          <button
            className="text-small-regular text-gray-700 underline"
            onClick={removeAddress}
          >
            Remove
          </button>
        </div>
      </div>

      <Modal isOpen={state} close={close}>
        <Modal.Title>Edit address</Modal.Title>
        <Modal.Body>
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <Input
              label="First name"
              {...register("first_name", {
                required: "First name is required",
              })}
              required
              errors={errors}
              autoComplete="given-name"
            />
            <Input
              label="Last name"
              {...register("last_name", {
                required: "Last name is required",
              })}
              required
              errors={errors}
              autoComplete="family-name"
            />
            <div className="col-span-full">
              <Input label="Company" {...register("company")} errors={errors} />
            </div>
            <div className="col-span-full">
              <Input
                label="Address"
                {...register("address_1", {
                  required: "Address is required",
                })}
                required
                errors={errors}
                autoComplete="address-line1"
              />
            </div>
            <div className="col-span-full">
              <Input
                label="Apartment, suite, etc."
                {...register("address_2")}
                errors={errors}
                autoComplete="address-line2"
              />
            </div>
            <Input
              label="Postal code"
              {...register("postal_code", {
                required: "Postal code is required",
              })}
              required
              errors={errors}
              autoComplete="postal-code"
            />
            <Input
              label="City"
              {...register("city", {
                required: "City is required",
              })}
              errors={errors}
              required
              autoComplete="city"
            />
            <Input
              label="Province"
              {...register("province")}
              errors={errors}
              autoComplete="address-level1"
            />
            <Controller
              name="country_code"
              rules={{ required: "Country is required", minLength: 2 }}
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <div className="flex flex-col justify-start">
                    <CountrySelect
                      onChange={onChange}
                      value={value}
                      errors={errors}
                      required
                    />
                  </div>
                )
              }}
            />
            <div className="col-span-full">
              <Input label="Phone" {...register("phone")} errors={errors} />
            </div>
          </div>
          {error && (
            <div className="text-rose-500 text-small-regular py-2">{error}</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="!bg-gray-200 !text-gray-900 !border-gray-200 min-h-0"
            onClick={close}
          >
            Cancel
          </Button>
          <Button className="min-h-0" onClick={submit} disabled={submitting}>
            Save
            {submitting && <Spinner />}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default EditAddress
