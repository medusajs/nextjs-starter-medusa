import Alert from "@modules/common/icons/alert"
import React from "react"

const PaymentTest = () => {
  return (
    <div className="flex items-center gap-x-2 mt-4">
      <Alert size={16} className="text-rose-700" />
      <span className="text-small-regular text-rose-700">
        For testing purposes only.
      </span>
    </div>
  )
}

export default PaymentTest
