import { Customer, SetRelation } from "@medusajs/client-types"
import React from "react"
import AddAddress from "../address-card/add-address"
import EditAddress from "../address-card/edit-address-modal"

type CustomerWithShippingAddresses = SetRelation<Customer, "shipping_addresses">

type AddressBookProps = {
  customer: CustomerWithShippingAddresses
}

const AddressBook: React.FC<AddressBookProps> = ({ customer }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 mt-4">
        <AddAddress />
        {customer.shipping_addresses.map((address) => {
          return <EditAddress address={address} key={address.id} />
        })}
      </div>
    </div>
  )
}

export default AddressBook
