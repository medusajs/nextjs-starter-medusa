"use client"

import { Metadata } from "next"

import InteractiveLink from "@modules/common/components/interactive-link"
import { useTranslations } from "next-intl"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}


export default function NotFound() {
  const t = useTranslations()
  
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">{t('PAGE_NOT_FOUND')}</h1>
      <p className="text-small-regular text-ui-fg-base">
        {t('THE_PAGE_YOU_TRIED_TO_ACCESS_D') as string}
      </p>
      <InteractiveLink href="/">{t('GO_TO_FRONTPAGE')}</InteractiveLink>
    </div>
  )
}
