"use client"

import { useState } from "react"
import { EditIcon, TrashIcon } from "lucide-react"

import { deleteCustomerAddress } from "@/utils/data/customer"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/primitives/button"
import { UpdateAddressDialog } from "@/components/features/account/dialogs/update-address-dialog copy"

import type { HttpTypes } from "@medusajs/types"

type Props = {
  address: HttpTypes.StoreCustomerAddress
  isActive?: boolean
  region: HttpTypes.StoreRegion
}

function AddressCard({ address, region, isActive = false }: Props) {
  const [removing, setRemoving] = useState(false)

  const removeAddress = async () => {
    setRemoving(true)
    await deleteCustomerAddress(address.id)
    setRemoving(false)
  }

  return (
    <div
      className={cn(
        "border rounded-xl h-full w-full flex flex-col justify-between transition-colors",
        {
          "border-foreground": isActive,
        }
      )}
      data-testid="address-container"
    >
      <div className="flex flex-col p-6">
        <h1 className="text-left text-sm" data-testid="address-name">
          {address.first_name} {address.last_name}
        </h1>
        {address.company && (
          <p className="text-sm text-foreground" data-testid="address-company">
            {address.company}
          </p>
        )}
        <p className="flex flex-col text-left text-base mt-2">
          <span data-testid="address-address">
            {address.address_1}
            {address.address_2 && <span>, {address.address_2}</span>}
          </span>
          <span data-testid="address-postal-city">
            {address.postal_code}, {address.city}
          </span>
          <span data-testid="address-province-country">
            {address.province && `${address.province}, `}
            {address.country_code?.toUpperCase()}
          </span>
        </p>
      </div>
      <div className="flex items-center p-6 gap-4 bg-secondary justify-end rounded-xl">
        <Button
          variant="transparent"
          size="clear"
          className="[&>svg]:size-4"
          onClick={removeAddress}
          isLoading={removing}
        >
          <TrashIcon />
          Remove
        </Button>
        <UpdateAddressDialog address={address} region={region} asChild>
          <Button
            variant="transparent"
            className="[&>svg]:size-4"
            size="clear"
            disabled={removing}
          >
            <EditIcon />
            Edit
          </Button>
        </UpdateAddressDialog>
      </div>
    </div>
  )
}

export { AddressCard }
export type { Props as AddressCardProps }
