import PageLayout from "app/page-layout"

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PageLayout>{children}</PageLayout>
}
