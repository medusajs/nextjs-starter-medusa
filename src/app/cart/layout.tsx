import PageLayout from "app/page-layout"

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PageLayout>{children}</PageLayout>
}
