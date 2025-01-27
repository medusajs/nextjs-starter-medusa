import { useTranslations } from "next-intl"
export const useSafeTranslations = (ns?: string) => {
  const _t = useTranslations(ns)
  return (key: string | undefined, props: Record<string, any> = {}) => {
    if (key) {
      const t = _t(key, { ...props })
      if (t) {
        return t
      }
    }
    return process.env.NEXT_PUBLIC_TRANSLATION_HELPERS
      ? `Missing translation ${ns}:${key}`
      : ""
  }
}