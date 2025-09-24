import { retrieveCustomer } from "@/utils/data/customer"
import { AccountLayout } from "@/components/layout/account/account-layout"

export default async function AccountPageLayout({
  dashboard,
  auth,
  params,
}: {
  dashboard?: React.ReactNode
  auth?: React.ReactNode
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const customer = await retrieveCustomer().catch(() => null)
  return (
    <AccountLayout customer={customer} countryCode={countryCode}>
      {customer ? dashboard : auth}
    </AccountLayout>
  )
}
