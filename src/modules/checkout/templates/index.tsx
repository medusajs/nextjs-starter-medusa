import { CheckoutProvider } from "@lib/context/checkout-context"
import ArrowRight from "@modules/common/icons/arrow-right"
import Link from "next/link"
import CheckoutLoader from "../components/checkout-loader"
import CheckoutForm from "./checkout-form"
import CheckoutSummary from "./checkout-summary"

const CheckoutTemplate = () => {
  return (
    <CheckoutProvider>
      <div className="bg-gray-100 relative min-h-screen">
        <div className="h-16 bg-white">
          <nav className="flex items-center h-full justify-between max-w-6xl mx-auto">
            <Link href="/cart">
              <a className="text-small-semi text-gray-700 flex items-center gap-x-2 uppercase flex-1 basis-0">
                <ArrowRight className="transform rotate-180" size={16} />
                <span className="mt-px">Back to shopping cart</span>
              </a>
            </Link>
            <Link href="/">
              <a className="text-xl-semi">ACME</a>
            </Link>
            <div className="flex-1 basis-0" />
          </nav>
        </div>
        <div className="relative">
          <CheckoutLoader />
          <div className="grid grid-cols-[1fr_416px] max-w-6xl mx-auto gap-x-8 py-12">
            <CheckoutForm />
            <CheckoutSummary />
          </div>
        </div>
      </div>
    </CheckoutProvider>
  )
}

export default CheckoutTemplate
