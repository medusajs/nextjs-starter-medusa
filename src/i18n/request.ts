import { getRequestConfig } from "next-intl/server"
import { cookies } from "next/headers"
import i18n from "@/i18n"

export default getRequestConfig(async () => {
  const store = await cookies()
  let locale = store.get("NEXT_LOCALE")?.value || i18n.defaultLocale

  if (!i18n.locales.some((l) => l.code === locale)) {
    locale = i18n.defaultLocale
    store.set("NEXT_LOCALE", locale)
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
