import Providers from "@modules/providers"
import "styles/globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-mode="light">
      <body className="h-screen">
        <Providers>
          <main className="relative h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
