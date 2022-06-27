import { useAccount } from "@lib/context/account-context"
import Spinner from "@modules/common/icons/spinner"
import React, { useEffect } from "react"
import AccountNav from "../components/account-nav"

const AccountLayout: React.FC = ({ children }) => {
  const { customer, retrievingCustomer, checkSession } = useAccount()

  useEffect(() => {
    checkSession()
  }, [checkSession])

  if (retrievingCustomer || !customer) {
    return (
      <div className="flex items-center justify-center w-full min-h-[640px] h-full text-gray-900">
        <Spinner size={36} />
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-[calc(100vh-64px)] py-12">
      <div className="flex-1 px-8 py-12 max-w-5xl mx-auto grid grid-cols-[140px_1fr]">
        <div>
          <AccountNav />
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

export default AccountLayout
