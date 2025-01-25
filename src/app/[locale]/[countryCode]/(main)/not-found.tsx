"use client"

import k from "@lib/i18n/translations/keys"
import { Metadata } from "next"

import InteractiveLink from "@modules/common/components/interactive-link"
import { useSafeTranslations } from "@lib/i18n/use-safe-translations"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

const t = useSafeTranslations()

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">{t(k.PAGE_NOT_FOUND)}</h1>
      <p className="text-small-regular text-ui-fg-base">
        {t(k.THE_PAGE_YOU_TRIED_TO_ACCESS_D) as string}
      </p>
      <InteractiveLink href="/">{t(k.GO_TO_FRONTPAGE)}</InteractiveLink>
    </div>
  )
}
