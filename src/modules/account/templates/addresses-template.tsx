import { useAccount } from "@lib/context/account-context"
import React from "react"
import AddressBook from "../components/address-book"

const AddressesTemplate = () => {
  const { customer, retrievingCustomer } = useAccount()

  if (retrievingCustomer || !customer) {
    return null
  }

  return (
    <div className="flex items-start max-w-7xl w-full">
      <AddressBook customer={customer} />
    </div>
  )
}

export default AddressesTemplate
