import { Customer } from "@medusajs/medusa"
import LoginDetails from "@modules/account/components/login-details"
import Name from "@modules/account/components/name"
import React from "react"

type MyInformationProps = {
  customer: Omit<Customer, "password_hash">
}

const MyInformation: React.FC<MyInformationProps> = ({ customer }) => {
  return (
    <div className="flex flex-col gap-y-8 flex-1 bg-white p-10">
      <div>
        <h1 className="uppercase text-2xl-semi">My information</h1>
        <span className="text-base-regular text-gray-700">
          Edit or add information to update your account.
        </span>
      </div>
      <div>
        <Name customer={customer} />
      </div>
      <div>
        <LoginDetails customer={customer} />
      </div>
    </div>
  )
}

export default MyInformation
