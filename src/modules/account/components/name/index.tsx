import { Customer } from "@medusajs/medusa"
import React from "react"
import Detail from "../detail-container"
import EditNameModal from "./edit-name-modal"

type NameProps = {
  customer: Omit<Customer, "password_hash">
}

const Name: React.FC<NameProps> = ({ customer }) => {
  return (
    <Detail title="Name">
      <div>
        <span>
          {customer.first_name} {customer.last_name}
        </span>
        <EditNameModal customer={customer} />
      </div>
    </Detail>
  )
}

export default Name
