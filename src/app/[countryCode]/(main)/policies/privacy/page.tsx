import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Luxe Linen",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="content-container py-16">
      <h1 className="text-2xl font-semibold text-ui-fg-base">
        Privacy Policy
      </h1>
      <div className="mt-6 space-y-4 text-ui-fg-subtle">
        <p>
          This Privacy Policy explains how Luxe Linen collects, uses, and
          protects your information when you use our website and services.
        </p>
        <p>
          Please update this page with your exact data collection practices,
          analytics tools, payment providers, and customer support processes.
        </p>
        <p>
          For privacy-related requests, contact us at:
          {" "}
          <span className="text-ui-fg-base">[add email]</span>
        </p>
      </div>
    </div>
  )
}
