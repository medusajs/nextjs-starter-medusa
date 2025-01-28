import { getBaseURL } from "@lib/util/env"
import { LOCALE_COOKIE, routing } from "@lib/i18n/settings";
import { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from 'next-intl/server';
import { setRequestLocale } from "next-intl/server"
import { cookies } from "next/headers"
import { Suspense } from "react"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale: requestedLocale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {

  // Set the request locale (for server-side context)
  setRequestLocale(await getLocale());

  const messages = await getMessages();

  return (
    <html lang={await getLocale()} data-mode="light">
      {/* Provide the intl context */}
      <NextIntlClientProvider messages={messages}>
        <body>
          <main className="relative">{children}</main>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
