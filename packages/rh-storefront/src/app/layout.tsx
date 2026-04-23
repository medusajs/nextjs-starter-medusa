import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Cormorant_Garamond } from "next/font/google"
import localFont from "next/font/local"
import "styles/globals.css"

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
  variable: "--font-serif",
})

const inter = localFont({
  src: [
    {
      path: "../fonts/Inter-Variable.woff2",
      style: "normal",
    },
    {
      path: "../fonts/Inter-Variable-Latin-Ext.woff2",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
  weight: "100 900",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-mode="light"
      className={`${cormorantGaramond.variable} ${inter.variable} min-h-full bg-qw-white`}
      suppressHydrationWarning
    >
      <body
        id="body-root"
        className="font-sans text-qw-charcoal bg-qw-white mx-auto min-w-0 w-full max-w-body overflow-x-clip antialiased"
        suppressHydrationWarning
      >
        <main className="relative min-w-0 w-full overflow-x-clip">
          <div className="min-w-0 w-full">{props.children}</div>
        </main>
      </body>
    </html>
  )
}
