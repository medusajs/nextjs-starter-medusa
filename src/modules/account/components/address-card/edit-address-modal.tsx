import { medusaClient } from "@lib/config"
import { useAccount } from "@lib/context/account-context"
import useToggleState from "@lib/hooks/use-toggle-state"
import { Address } from "@medusajs/medusa"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import Select, { SelectOption } from "@modules/common/components/select"
import Spinner from "@modules/common/icons/spinner"
import { useRegions } from "medusa-react"
import React, { useMemo, useState } from "react"
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
}

const EditAddress: React.FC<EditAddressProps> = ({ address }) => {
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

  const { regions } = useRegions()

  const countyOptions = useMemo(() => {
    const options = regions?.reduce((acc, region) => {
      for (const country of region.countries) {
        acc.push({ label: country.name, value: country.iso_2 })
      }
      return acc
    }, [] as SelectOption[])

    return options
  }, [regions])

  const submit = handleSubmit(async (data: FormValues) => {
    setSubmitting(true)
    setError(undefined)

    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      company: data.company || "NULL",
      address_1: data.address_1,
      address_2: data.address_2 || "",
      city: data.city,
      country_code: data.country_code,
      province: data.province || "",
      postal_code: data.postal_code,
      phone: data.phone || "NULL",
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
      <div className="border border-gray-200 p-5 min-h-[220px] h-full w-full flex flex-col justify-between">
        <div className="flex flex-col">
          <span className="text-left text-base-semi">
            {address.first_name} {address.last_name}
          </span>
          <div className="flex flex-col text-left text-base-regular mt-2">
            <span>{address.address_1}</span>
            {address.address_2 && <span>{address.address_2}</span>}
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
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-full mb-4">
              <Controller
                name="country_code"
                rules={{ required: "Country is required", minLength: 2 }}
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <Select
                      options={countyOptions || []}
                      onChange={onChange}
                      value={value}
                      placeholder="Country"
                    />
                  )
                }}
              />
            </div>
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
            <div className="col-span-full">
              <Input
                label="Province"
                {...register("province")}
                errors={errors}
                autoComplete="address-level1"
              />
            </div>
            <div className="col-span-full">
              <Input label="Phone" {...register("phone")} errors={errors} />
            </div>
          </div>
          {error && (
            <div className="text-rose-500 text-small-regular py-2">{error}</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-gray-200 text-gray-900 py-2 px-4 uppercase text-base-semi"
            onClick={close}
          >
            Cancel
          </button>
          <button
            className="bg-gray-900 flex items-center gap-x-2 text-white py-2 px-4 uppercase text-base-semi disabled:bg-gray-400"
            onClick={submit}
            disabled={submitting}
          >
            Save
            {submitting && <Spinner />}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default EditAddress
