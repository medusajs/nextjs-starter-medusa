import { getCustomer } from "@lib/data"
import AccountLayout from "@modules/account/templates/account-layout"

import { getCurrentLocale, setStaticParams } from "../../../../locales/server"

export default async function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  setStaticParams(getCurrentLocale())

  const customer = await getCustomer().catch(() => null)

  return (
    <AccountLayout customer={customer}>
      {customer ? dashboard : login}
    </AccountLayout>
  )
}
