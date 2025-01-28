import { useTranslations } from "next-intl"

import { Metadata } from "next"

import InteractiveLink from "@modules/common/components/interactive-link"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  const t = useTranslations()
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">{t('PAGE_NOT_FOUND')}</h1>
      <p className="text-small-regular text-ui-fg-base">
        {t('THE_CART_YOU_TRIED_TO_ACCESS_D')}
      </p>
      <InteractiveLink href="/">{t('GO_TO_FRONTPAGE')}</InteractiveLink>
    </div>
  )
}
