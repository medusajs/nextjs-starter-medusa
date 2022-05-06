import { CheckoutProvider } from "@lib/context/checkout-context"
import Link from "next/link"
import React from "react"
import CheckoutForm from "./checkout-form"
import CheckoutSummary from "./checkout-summary"

const CheckoutTemplate = () => {
  return (
    <CheckoutProvider>
      <div className="h-16">
        <nav className="flex items-center h-full px-8 border-b border-gray-200">
          <Link href="/">
            <a className="text-2xl-semi">ACME</a>
          </Link>
        </nav>
      </div>
      <div className="flex flex-col-reverse gap-y-8 lg:gap-y-0 lg:flex-row">
        <div className="w-full lg:w-[70%] flex justify-center">
          <CheckoutForm />
        </div>
        <div className="w-full lg:w-[30%]">
          <CheckoutSummary />
        </div>
      </div>
    </CheckoutProvider>
  )
}

export default CheckoutTemplate
