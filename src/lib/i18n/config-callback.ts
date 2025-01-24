import { getRequestConfig } from "next-intl/server";
import { fallbackLng, languages } from "./settings";

export const getI18NConfigCallback = async ({
  requestLocale,
}: {
  requestLocale: Promise<string | undefined>;
}) => {
  // Resolve the locale asynchronously
  const resolvedRequestLocale = (await requestLocale) || fallbackLng;

  // Validate the locale and fallback if necessary
  const resolvedLocale = languages.includes(resolvedRequestLocale)
    ? resolvedRequestLocale
    : fallbackLng;

  return {
    locale: resolvedLocale, // Add the resolved locale
    messages: (await import(`@locales/${resolvedLocale}.json`)).default, // Load messages dynamically
  };
};

export default getRequestConfig(getI18NConfigCallback);
