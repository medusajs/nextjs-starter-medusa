import PageLayout from "app/page-layout"

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PageLayout>{children}</PageLayout>
}
