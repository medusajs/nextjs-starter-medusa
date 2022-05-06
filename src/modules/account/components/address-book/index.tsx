import { Customer } from "@medusajs/medusa"
import React from "react"
import AddAddress from "../address-card/add-address"
import EditAddress from "../address-card/edit-address-modal"

type AddressBookProps = {
  customer: Omit<Customer, "password_hash">
}

const AddressBook: React.FC<AddressBookProps> = ({ customer }) => {
  return (
    <div className="w-full p-10 bg-white">
      <h1 className="uppercase text-2xl-semi">Address book</h1>
      <span className="text-base-regular text-gray-700">
        Save your addresses to speed up your checkout experience.
      </span>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 mt-4">
        {customer.shipping_addresses.map((address) => {
          return <EditAddress address={address} key={address.id} />
        })}
        <AddAddress />
      </div>
    </div>
  )
}

export default AddressBook
