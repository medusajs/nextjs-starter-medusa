import { CheckoutProvider } from "@lib/context/checkout-context"
import ArrowRight from "@modules/common/icons/arrow-right"
import Link from "next/link"
import React from "react"
import CheckoutForm from "./checkout-form"
import CheckoutSummary from "./checkout-summary"

const CheckoutTemplate = () => {
  return (
    <CheckoutProvider>
      <div className="bg-gray-50">
        <div className="h-16">
          <nav className="flex items-center h-full px-8 justify-between">
            <Link href="/">
              <a className="text-small-regular text-gray-700 flex items-center gap-x-2 uppercase w-20">
                <ArrowRight className="transform rotate-180" size={16} />
                <span className="mt-px">Store</span>
              </a>
            </Link>
            <Link href="/">
              <a className="text-xl-semi">ACME</a>
            </Link>
            <div className="w-20" />
          </nav>
        </div>
        <div className="flex flex-col gap-y-8 lg:gap-y-0 lg:gap-x-4 lg:flex-row">
          <div className="w-full">
            <CheckoutForm />
          </div>
          <div className="w-full">
            <CheckoutSummary />
          </div>
        </div>
      </div>
    </CheckoutProvider>
  )
}

export default CheckoutTemplate
