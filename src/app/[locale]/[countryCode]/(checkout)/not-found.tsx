import { useTranslations } from "next-intl"
import InteractiveLink from "@modules/common/components/interactive-link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default async function NotFound() {
  const t = useTranslations()

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">{t('PAGE_NOT_FOUND')}</h1>
      <p className="text-small-regular text-ui-fg-base">
        {t('THE_PAGE_YOU_TRIED_TO_ACCESS_D')}
      </p>
      <InteractiveLink href="/">{t('GO_TO_FRONTPAGE')}</InteractiveLink>
    </div>
  )
}
