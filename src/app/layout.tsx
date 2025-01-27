import { getBaseURL } from "@lib/util/env"
import getI18NRequestConfig from "@lib/i18n/request-config";
import { LOCALE_COOKIE, routing } from "@lib/i18n/settings";
import { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
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
  // determine the locale to use based on URL, cookie, or fallback
  const isValidLocale = routing.locales.includes(requestedLocale);
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  const finalLocale = isValidLocale 
    ? requestedLocale 
    : cookieLocale && routing.locales.includes(cookieLocale)
      ? cookieLocale
      : routing.defaultLocale;

  // Set the request locale (for server-side context)
  setRequestLocale(finalLocale);
  // load translations for the determined locale
  const { messages } = await getI18NRequestConfig({
    requestLocale: Promise.resolve(finalLocale),
  });

  return (
    <html lang={finalLocale} data-mode="light">
      {/* Provide the intl context */}
      <NextIntlClientProvider locale={finalLocale} messages={messages}>
        <body>
          <main className="relative">{children}</main>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
