const { getI18NRequestConfig } = require("next-intl/server");
const { fallbackLng, languages } = require("./settings");

const requestConfig = getI18NRequestConfig(async ({ requestLocale }: { requestLocale: Promise<string | undefined> }) => {
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
});

export default requestConfig;
