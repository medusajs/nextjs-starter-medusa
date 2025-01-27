import { defineRouting } from 'next-intl/routing';

export const fallbackLng = "en"
export const languages = [
  fallbackLng,
  "ar"
]
export const localePrefix = "always"
export const LOCALE_COOKIE = "NEXT_LOCALE"

export const routing = defineRouting({
  locales: languages,
  defaultLocale: fallbackLng,
  localeDetection: true,
})