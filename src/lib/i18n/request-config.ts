import { getRequestConfig } from "next-intl/server";
import { routing } from "./settings";
import type { Formats } from "next-intl";

export const formats: Formats = {
  dateTime: {
    short: {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  },
  number: {
    precise: {
      maximumFractionDigits: 5,
    },
  },
  list: {
    enumeration: {
      style: 'long',
      type: 'conjunction',
    },
  },
} satisfies Formats;

export type FormatsType = typeof formats;

const getI18NRequestConfig = getRequestConfig(async ({ requestLocale }: { requestLocale: Promise<string | undefined> }) => {
  // resolve the locale asynchronously
  const resolvedRequestLocale = (await requestLocale) || routing.defaultLocale;

  // validate the locale and fallback if necessary
  const resolvedLocale = routing.locales.includes(resolvedRequestLocale)
    ? resolvedRequestLocale
    : routing.defaultLocale;

  return {
    locale: resolvedLocale,
    messages: (await import(`@locales/${resolvedLocale}.ts`)).default, 
    formats,
  };
});

export default getI18NRequestConfig;

