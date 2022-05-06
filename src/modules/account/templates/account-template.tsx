import { useAccount } from "@lib/context/account-context"
import ArrowRight from "@modules/common/icons/arrow-right"
import React, { useState } from "react"
import AddressBook from "../components/address-book"
import MyInformation from "../components/my-information"

enum VIEW {
  MY_INFORMATION = "my_information",
  ADDRESS_BOOK = "address_book",
}

const AccountTemplate = () => {
  const { customer, retrievingCustomer } = useAccount()
  const [view, setView] = useState<VIEW>(VIEW.MY_INFORMATION)

  if (retrievingCustomer || !customer) {
    return null
  }

  return (
    <div className="flex items-start max-w-7xl gap-x-8 w-full">
      <div className="bg-white flex flex-col w-full max-w-xs">
        <button
          onClick={() => setView(VIEW.MY_INFORMATION)}
          className="flex justify-between p-5 hover:bg-gray-900 hover:text-white transition-colors duration-300 text-base-semi uppercase"
        >
          <span>Personal information</span>
          <ArrowRight />
        </button>
        <button
          onClick={() => setView(VIEW.ADDRESS_BOOK)}
          className="flex justify-between p-5 hover:bg-gray-900 hover:text-white transition-colors duration-300 text-base-semi uppercase"
        >
          <span>Address book</span>
          <ArrowRight />
        </button>
        <button className="flex justify-between p-5 hover:bg-gray-900 hover:text-white transition-colors duration-300 text-base-semi uppercase">
          <span>Log out</span>
          <ArrowRight />
        </button>
      </div>

      {view === VIEW.MY_INFORMATION ? (
        <MyInformation customer={customer} />
      ) : (
        <AddressBook customer={customer} />
      )}
    </div>
  )
}

export default AccountTemplate
