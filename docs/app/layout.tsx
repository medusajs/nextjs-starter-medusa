import 'nextra-theme-docs/style.css'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <body>
        {children}
      </body>
    </html>
  )
}
