import PageLayout from "app/page-layout"

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PageLayout>{children}</PageLayout>
}
