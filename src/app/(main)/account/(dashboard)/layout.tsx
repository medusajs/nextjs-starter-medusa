import AccountLayout from "@modules/account/templates/account-layout"

export default function AccountPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AccountLayout>{children}</AccountLayout>
}
