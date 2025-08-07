import { Metadata } from "next"
import { retrieveCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"
import LoginTemplate from "@modules/account/templates/login-template"
import Overview from "@modules/account/components/overview"

export const metadata: Metadata = {
  title: "Account",
  description: "Overview of your account activity.",
}

export default async function AccountPage() {
  const customer = await retrieveCustomer().catch(() => null)
  const orders = customer ? (await listOrders().catch(() => null)) || null : null

  if (!customer) {
    return <LoginTemplate />
  }

  return <Overview customer={customer} orders={orders} />
}
