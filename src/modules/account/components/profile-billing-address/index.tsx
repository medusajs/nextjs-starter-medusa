"use client"

import React, { useEffect, useMemo } from "react"

import Input from "@modules/common/components/input"
import NativeSelect from "@modules/common/components/native-select"

import AccountInfo from "../account-info"
import { useFormState } from "react-dom"
import { updateCustomerBillingAddress } from "@modules/account/actions"
import { HttpTypes } from "@medusajs/types"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
  regions: HttpTypes.StoreRegion[]
}

const ProfileBillingAddress: React.FC<MyInformationProps> = ({
  customer,
  regions,
}) => {
  const regionOptions = useMemo(() => {
    return (
      regions
        ?.map((region) => {
          return region.countries?.map((country) => ({
            value: country.iso_2,
            label: country.display_name,
          }))
        })
        .flat() || []
    )
  }, [regions])

  const [successState, setSuccessState] = React.useState(false)

  const [state, formAction] = useFormState(
    updateCustomerBillingAddress as any,
    {
      error: false,
      success: false,
    }
  )

  const clearState = () => {
    setSuccessState(false)
  }

  useEffect(() => {
    setSuccessState(state.success)
  }, [state])

  const currentInfo = useMemo(() => {
    // TODO: Fix all customer as any typings
    if (!(customer as any).billing_address) {
      return "No billing address"
    }

    const country =
      regionOptions?.find(
        (country) =>
          country?.value === (customer as any).billing_address.country_code
      )?.label || (customer as any).billing_address.country_code?.toUpperCase()

    return (
      <div className="flex flex-col font-semibold" data-testid="current-info">
        <span>
          {(customer as any).billing_address.first_name}{" "}
          {(customer as any).billing_address.last_name}
        </span>
        <span>{(customer as any).billing_address.company}</span>
        <span>
          {(customer as any).billing_address.address_1}
          {(customer as any).billing_address.address_2
            ? `, ${(customer as any).billing_address.address_2}`
            : ""}
        </span>
        <span>
          {(customer as any).billing_address.postal_code},{" "}
          {(customer as any).billing_address.city}
        </span>
        <span>{country}</span>
      </div>
    )
  }, [customer, regionOptions])

  return (
    <form action={formAction} onReset={() => clearState()} className="w-full">
      <AccountInfo
        label="Billing address"
        currentInfo={currentInfo}
        isSuccess={successState}
        isError={!!state.error}
        clearState={clearState}
        data-testid="account-billing-address-editor"
      >
        <div className="grid grid-cols-1 gap-y-2">
          <div className="grid grid-cols-2 gap-x-2">
            <Input
              label="First name"
              name="billing_address.first_name"
              defaultValue={
                (customer as any).billing_address?.first_name || undefined
              }
              required
              data-testid="billing-first-name-input"
            />
            <Input
              label="Last name"
              name="billing_address.last_name"
              defaultValue={
                (customer as any).billing_address?.last_name || undefined
              }
              required
              data-testid="billing-last-name-input"
            />
          </div>
          <Input
            label="Company"
            name="billing_address.company"
            defaultValue={
              (customer as any).billing_address?.company || undefined
            }
            data-testid="billing-company-input"
          />
          <Input
            label="Address"
            name="billing_address.address_1"
            defaultValue={
              (customer as any).billing_address?.address_1 || undefined
            }
            required
            data-testid="billing-address-1-input"
          />
          <Input
            label="Apartment, suite, etc."
            name="billing_address.address_2"
            defaultValue={
              (customer as any).billing_address?.address_2 || undefined
            }
            data-testid="billing-address-2-input"
          />
          <div className="grid grid-cols-[144px_1fr] gap-x-2">
            <Input
              label="Postal code"
              name="billing_address.postal_code"
              defaultValue={
                (customer as any).billing_address?.postal_code || undefined
              }
              required
              data-testid="billing-postcal-code-input"
            />
            <Input
              label="City"
              name="billing_address.city"
              defaultValue={
                (customer as any).billing_address?.city || undefined
              }
              required
              data-testid="billing-city-input"
            />
          </div>
          <Input
            label="Province"
            name="billing_address.province"
            defaultValue={
              (customer as any).billing_address?.province || undefined
            }
            data-testid="billing-province-input"
          />
          <NativeSelect
            name="billing_address.country_code"
            defaultValue={
              (customer as any).billing_address?.country_code || undefined
            }
            required
            data-testid="billing-country-code-select"
          >
            <option value="">-</option>
            {regionOptions.map((option, i) => {
              return (
                <option key={i} value={option?.value}>
                  {option?.label}
                </option>
              )
            })}
          </NativeSelect>
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfileBillingAddress
