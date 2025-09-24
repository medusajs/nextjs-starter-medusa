import { getTranslations } from "next-intl/server"

import { generateMeta } from "@/utils/meta/generate-meta"

import { AuthTemplate } from "@/components/features/auth/templates/auth-template"

type Props = {
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata({ params }: Props) {
  const { countryCode } = await params
  const t = await getTranslations("pages.auth.login.meta")

  generateMeta({
    meta: {
      title: t("title"),
      description: t("description"),
    },
    slug: [countryCode, "auth", "login"],
  })
}

export default function LoginPage() {
  return <AuthTemplate />
}
