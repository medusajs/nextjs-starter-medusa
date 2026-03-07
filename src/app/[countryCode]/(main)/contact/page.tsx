import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact | Luxe Linen",
}

export default function ContactPage() {
  return (
    <div className="content-container py-16">
      <h1 className="text-2xl font-semibold text-ui-fg-base">Contact</h1>
      <div className="mt-6 space-y-4 text-ui-fg-subtle">
        <p>
          Please update the contact details below to match your local office
          information.
        </p>
        <div>
          <p className="text-ui-fg-base">Office Address</p>
          <p>[add your local office address in Pakistan]</p>
        </div>
        <div>
          <p className="text-ui-fg-base">Phone</p>
          <p>[add your contact number]</p>
        </div>
        <div>
          <p className="text-ui-fg-base">Email</p>
          <p>[add your support email]</p>
        </div>
      </div>
    </div>
  )
}
