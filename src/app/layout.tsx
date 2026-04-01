import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Cormorant_Garamond } from "next/font/google"
import "styles/globals.css"

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
  variable: "--font-serif",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-mode="light"
      className={cormorantGaramond.variable}
      suppressHydrationWarning
    >
      <body
        className="font-sans text-qw-charcoal bg-qw-white overflow-x-hidden"
        suppressHydrationWarning
      >
        <main className="relative overflow-x-hidden">{props.children}</main>
      </body>
    </html>
  )
}
