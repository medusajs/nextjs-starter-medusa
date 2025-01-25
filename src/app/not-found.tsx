import k from "@lib/i18n/translations/keys"
import { ArrowUpRightMini } from "@medusajs/icons"
import { Text } from "@medusajs/ui"
import { Metadata } from "next"
import { Link } from "@lib/i18n/navigation"
import { useSafeTranslations } from "@lib/i18n/use-safe-translations"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  const t = useSafeTranslations()

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">{t(k.PAGE_NOT_FOUND)}</h1>
      <p className="text-small-regular text-ui-fg-base">
        {t(k.THE_PAGE_YOU_TRIED_TO_ACCESS_D)}
      </p>
      <Link
        className="flex gap-x-1 items-center group"
        href="/"
      >
        <Text className="text-ui-fg-interactive">{t(k.GO_TO_FRONTPAGE)}</Text>
        <ArrowUpRightMini
          className="group-hover:rotate-45 ease-in-out duration-150"
          color="var(--fg-interactive)"
        />
      </Link>
    </div>
  )
}
