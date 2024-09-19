import { getI18n, getCurrentLocale, setStaticParams } from "../../../locales/server"

import { Metadata } from "next"

import InteractiveLink from "@modules/common/components/interactive-link"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default async function NotFound() {
  setStaticParams(getCurrentLocale())
  const t = await getI18n()

  metadata.description = t("generic.somethingwrong")

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">
        {t("generic.notfound_title")}
      </h1>
      <p className="text-small-regular text-ui-fg-base">
        {t("generic.notfound_desc")}
      </p>
      <InteractiveLink href="/">{t("generic.notfound_link")}</InteractiveLink>
    </div>
  )
}
