import Providers from "@modules/providers"

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Providers>{children}</Providers>
}
