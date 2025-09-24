import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { generateMeta } from "@/utils/meta/generate-meta"
import { retrieveCart } from "@/utils/data/cart"
import { listRegions } from "@/utils/data/regions"
import { retrieveCustomer } from "@/utils/data/customer"

import { LanguageSelect } from "@/components/features/account/selects/language-select"
import { Label } from "@/components/ui/primitives/label"
import { CountrySelect } from "@/components/features/account/selects/country-select"
import { Input } from "@/components/ui/primitives/input"

type Props = {
  params: Promise<{
    countryCode: string
  }>
}

export async function generateMetadata({ params }: Props) {
  const { countryCode } = await params
  const t = await getTranslations("pages.account.region.meta")

  return generateMeta({
    meta: {
      title: t("title"),
      description: t("description"),
    },
    slug: [countryCode, "account", "region"],
  })
}

export default async function RegionPage({ params }: Props) {
  const { countryCode } = await params
  const t = await getTranslations("pages.account.region.label")
  const customer = await retrieveCustomer()
  const regions = await listRegions()
  const cart = await retrieveCart()

  if (!customer || !regions) {
    notFound()
  }

  const region = regions.find((r) =>
    r.countries?.some((c) => c.iso_2 == countryCode)
  )

  return (
    <div className="w-full" data-testid="profile-page-wrapper">
      <div className="flex flex-col gap-y-8 w-full max-w-xl">
        <div className="grid gap-2">
          <Label>{t("country")}</Label>
          <CountrySelect regions={regions} />
        </div>
        <div className="grid gap-2">
          <Label>{t("language")}</Label>
          <LanguageSelect />
        </div>
        <div className="grid gap-2">
          <Label>{t("currency")}</Label>
          <Input
            value={cart?.currency_code || region?.currency_code}
            className="uppercase cursor-pointer"
            size="lg"
          />
        </div>
      </div>
    </div>
  )
}
