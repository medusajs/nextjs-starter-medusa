const { getRequestConfig } = require("next-intl/server");
import { routing } from "./settings";

const getI18NRequestConfig = getRequestConfig(async ({ requestLocale }: { requestLocale: Promise<string | undefined> }) => {
  // resolve the locale asynchronously
  const resolvedRequestLocale = (await requestLocale) || routing.defaultLocale;

  // validate the locale and fallback if necessary
  const resolvedLocale = routing.locales.includes(resolvedRequestLocale)
    ? resolvedRequestLocale
    : routing.defaultLocale;

  return {
    locale: resolvedLocale,
    messages: (await import(`./translations/locales/${resolvedLocale}.ts`)).default,
  };
});

export default getI18NRequestConfig;

