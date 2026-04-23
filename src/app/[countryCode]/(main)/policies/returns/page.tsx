import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Returns & Refunds | Luxe Linen",
}

export default function ReturnsPolicyPage() {
  return (
    <div className="content-container py-16">
      <h1 className="text-2xl font-semibold text-ui-fg-base">
        Returns & Refunds
      </h1>
      <div className="mt-6 space-y-4 text-ui-fg-subtle">
        <p>
          Please update this policy with your return window, eligibility
          criteria, refund method, and processing timelines.
        </p>
        <p>
          For return requests, contact:
          {" "}
          <span className="text-ui-fg-base">[add support email/phone]</span>
        </p>
      </div>
    </div>
  )
}
