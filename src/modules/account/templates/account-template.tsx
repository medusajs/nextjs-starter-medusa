import { useAccount } from "@lib/context/account-context"
import React, { useState } from "react"
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
    <div className="flex items-start max-w-7xl w-full">
      <MyInformation customer={customer} />
    </div>
  )
}

export default AccountTemplate
