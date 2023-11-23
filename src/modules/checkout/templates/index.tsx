import { CheckoutProvider } from "@lib/context/checkout-context"
import ChevronDown from "@modules/common/icons/chevron-down"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import Link from "next/link"
import CheckoutLoader from "../components/checkout-loader"
import CheckoutForm from "./checkout-form"
import CheckoutSummary from "./checkout-summary"
import SubmitSpinner from "../components/submit-spinner"

const CheckoutTemplate = () => {
  return (
    <CheckoutProvider>
      <div className="bg-white relative small:min-h-screen">
        <SubmitSpinner />
        <div className="h-16 bg-white">
          <nav className="flex items-center h-full justify-between content-container border-b">
            <Link
              href="/cart"
              className="text-small-semi text-gray-700 flex items-center gap-x-2 uppercase flex-1 basis-0"
            >
              <>
                <ChevronDown className="rotate-90" size={16} />
                <span className="mt-px hidden small:block txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase">
                  Back to shopping cart
                </span>
                <span className="mt-px block small:hidden">Back</span>
              </>
            </Link>
            <Link
              href="/"
              className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase"
            >
              Medusa Store
            </Link>
            <div className="flex-1 basis-0" />
          </nav>
        </div>
        <div className="relative">
          <CheckoutLoader />
          <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] content-container gap-x-40 py-12">
            <CheckoutForm />
            <CheckoutSummary />
          </div>
        </div>
        <div className="py-4 w-full flex items-center justify-center">
          <MedusaCTA />
        </div>
      </div>
    </CheckoutProvider>
  )
}

export default CheckoutTemplate
