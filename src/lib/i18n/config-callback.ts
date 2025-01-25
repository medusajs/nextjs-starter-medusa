import { getRequestConfig } from "next-intl/server";
import { fallbackLng, languages } from "./settings";

export const getI18NConfigCallback = async ({
  requestLocale,
}: {
  requestLocale: Promise<string | undefined>;
}) => {
  // resolve the locale asynchronously
  const resolvedRequestLocale = (await requestLocale) || fallbackLng;

  // validate the locale and fallback if necessary
  const resolvedLocale = languages.includes(resolvedRequestLocale)
    ? resolvedRequestLocale
    : fallbackLng;

  return {
    locale: resolvedLocale,
    messages: (await import(`./translations/locales/${resolvedLocale}.ts`)).default,
  };
};

export default getRequestConfig(getI18NConfigCallback);
