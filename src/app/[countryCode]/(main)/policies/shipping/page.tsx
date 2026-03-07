import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shipping Policy | Luxe Linen",
}

export default function ShippingPolicyPage() {
  return (
    <div className="content-container py-16">
      <h1 className="text-2xl font-semibold text-ui-fg-base">
        Shipping Policy
      </h1>
      <div className="mt-6 space-y-4 text-ui-fg-subtle">
        <p>
          Please update this policy with your shipping zones, delivery times,
          shipping fees, and courier partners.
        </p>
        <p>
          For shipping questions, contact:
          {" "}
          <span className="text-ui-fg-base">[add support email/phone]</span>
        </p>
      </div>
    </div>
  )
}
