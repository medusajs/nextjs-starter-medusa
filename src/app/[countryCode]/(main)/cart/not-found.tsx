import Link from "next/link"

import { getTranslations } from "next-intl/server"

import { Button } from "@/components/ui/primitives/button"
import { generateMeta } from "@/utils/meta/generate-meta"
import { ShoppingCartIcon } from "lucide-react"

type Props = {
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata({ params }: Props) {
  const { countryCode } = await params
  const t = await getTranslations("pages.cart.not_found")
  return generateMeta({
    meta: {
      title: t("title"),
      description: t("message"),
    },
    slug: [countryCode, "cart"],
  })
}

export default async function NotFound() {
  const t = await getTranslations("pages.cart.not_found")
  return (
    <div className="flex flex-col items-center justify-center py-40 max-w-xl mx-auto">
      <ShoppingCartIcon
        className="size-24 text-muted-foreground"
        strokeWidth={1}
      />
      <h1 className="text-xl font-semibold text-foreground mt-4">
        {t("title")}
      </h1>
      <p className="text-muted-foreground text-center mb-5">{t("message")}</p>
      <Link href="/">
        <Button size="lg">{t("button")}</Button>
      </Link>
    </div>
  )
}
