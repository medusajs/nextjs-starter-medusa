import "@/styles/globals.css"

import { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale } from "next-intl/server"

import { getBaseURL } from "@/utils/helpers/env"

import { Main } from "@/components/ui/react/design-system"
import { Providers } from "@/components/providers"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const locale = await getLocale()
  return (
    <html lang={locale} data-mode="light">
      <body className="overflow-x-hidden">
        <Main className="relative">
          <NextIntlClientProvider locale={locale}>
            <Providers>{props.children}</Providers>
          </NextIntlClientProvider>
        </Main>
      </body>
    </html>
  )
}
