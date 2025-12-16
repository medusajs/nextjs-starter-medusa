"use server"

import { sdk } from "@lib/config"
import { getCacheOptions, setLocale } from "./cookies"
import medusaError from "../util/medusa-error"
import { getLocale } from "./cookies"

export const getLocales = async () => {
  const next = {
    ...(await getCacheOptions("locales")),
  }
  return sdk.client
    .fetch<{ locales: { code: string; name: string }[] }>("/store/locales", {
      next,
      cache: "force-cache",
    })
    .then(({ locales }) => locales)
    .catch(medusaError)
}

export const getConfiguredLocale = async () => {
  return getLocale().then((locale) => locale)
}

export const setConfiguredLocale = async (locale: string) => {
  return setLocale(locale)
}
