"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/primitives/select"
import i18n from "@/i18n"
import { useLocale } from "next-intl"
import { setCookie } from "cookies-next"

function LanguageSelect() {
  const locale = useLocale()

  function handleChange(locale: string) {
    setCookie("NEXT_LOCALE", locale)
    window.location.reload()
  }

  return (
    <Select defaultValue={locale} onValueChange={handleChange}>
      <SelectTrigger size="lg" className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {i18n.locales.map((locale) => (
          <SelectItem value={locale.code} key={locale.code}>
            {locale.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { LanguageSelect }
