import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { listRegions } from "@/utils/data/regions"
import { retrieveCustomer } from "@/utils/data/customer"
import { generateMeta } from "@/utils/meta/generate-meta"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/primitives/accordion"
import { UpdateProfileNameForm } from "@/components/features/account/forms/update-name"
import { UpdateEmailForm } from "@/components/features/account/forms/update-email-form"
import { UpdatePhoneForm } from "@/components/features/account/forms/update-phone-form"
import { UpdatePasswordForm } from "@/components/features/account/forms/update-password-form"

type Props = {
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata({ params }: Props) {
  const { countryCode } = await params
  const t = await getTranslations("pages.account.profile.meta")

  return generateMeta({
    meta: {
      title: t("title"),
      description: t("description"),
    },
    slug: [countryCode, "account", "profile"],
  })
}

export default async function ProfilePage() {
  const t = await getTranslations("pages.account.profile")
  const customer = await retrieveCustomer()
  const regions = await listRegions()

  if (!customer || !regions) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="profile-page-wrapper">
      <Accordion type="multiple">
        <AccordionItem value="profile-name">
          <AccordionTrigger>
            <div className="flex flex-col items-start text-sm">
              <p>{t("label.name")}</p>
              <p className="font-bold">
                {customer.first_name} {customer.last_name}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <UpdateProfileNameForm customer={customer} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="email">
          <AccordionTrigger>
            <div className="flex flex-col items-start text-sm">
              <p>{t("label.email")}</p>
              <p className="font-bold">{customer.email}</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <UpdateEmailForm customer={customer} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="phone">
          <AccordionTrigger>
            <div className="flex flex-col items-start text-sm">
              <p>{t("label.phone")}</p>
              <p className="font-bold">{customer.phone}</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <UpdatePhoneForm customer={customer} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="password">
          <AccordionTrigger>
            <div className="flex flex-col items-start text-sm">
              <p>{t("label.password")}</p>
              <p className="text-muted-foreground">
                {t("description.password")}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <UpdatePasswordForm />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
