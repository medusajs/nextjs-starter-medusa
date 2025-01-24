import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { getI18NConfigCallback } from "@lib/i18n/config-callback"
import { LOCALE_COOKIE, fallbackLng, languages } from "@lib/i18n/settings"
import { NextIntlClientProvider } from "next-intl"
import { unstable_setRequestLocale } from "next-intl/server"
import { cookies } from "next/headers"
import { Suspense } from "react"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export function generateStaticParams() {
  return languages.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale: localeParam },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {

  // Determine the locale to use
  const locale = languages.includes(localeParam)
    ? localeParam
    : (await cookies()).get(LOCALE_COOKIE)?.value || fallbackLng;

  // Set the request locale (for server-side context)
  unstable_setRequestLocale(locale);

  // Load translations for the determined locale
  const { messages } = await getI18NConfigCallback({
    locale,
    requestLocale: Promise.resolve(undefined)
  });

  return (
    <html lang={locale} data-mode="light">
      {/* Provide the intl context */}
      <NextIntlClientProvider locale={locale} messages={messages}>
        <body>
          <main className="relative">{children}</main>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
