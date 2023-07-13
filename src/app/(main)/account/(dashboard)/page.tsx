import OverviewTemplate from "@modules/account/templates/overview-template"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Account",
  description: "Overview of your account activity.",
}

export default function Account() {
  return <OverviewTemplate />
}
