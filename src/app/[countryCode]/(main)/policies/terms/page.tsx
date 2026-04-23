import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions | Luxe Linen",
}

export default function TermsPage() {
  return (
    <div className="content-container py-16">
      <h1 className="text-2xl font-semibold text-ui-fg-base">
        Terms & Conditions
      </h1>
      <div className="mt-6 space-y-4 text-ui-fg-subtle">
        <p>
          Please update these terms with your business name, legal entity,
          customer obligations, limitations of liability, and governing law.
        </p>
        <p>
          For questions about these terms, contact:
          {" "}
          <span className="text-ui-fg-base">[add support email/phone]</span>
        </p>
      </div>
    </div>
  )
}
