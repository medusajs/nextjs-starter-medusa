import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { getRegion } from "@/utils/data/regions"
import { retrieveCustomer } from "@/utils/data/customer"
import { generateMeta } from "@/utils/meta/generate-meta"

import { AddAddressDialog } from "@/components/features/account/dialogs/add-address-dialog"
import { Button } from "@/components/ui/primitives/button"
import { AddressCard } from "@/components/features/account/cards/address-card"
import { Separator } from "@/components/ui/primitives/separator"

type Props = {
  params: Promise<{
    countryCode: string
  }>
}

export async function generateMetadata({ params }: Props) {
  const { countryCode } = await params
  const t = await getTranslations("pages.account.addresses.meta")

  return generateMeta({
    meta: {
      title: t("title"),
      description: t("description"),
    },
    slug: [countryCode, "account", "addresses"],
  })
}

export default async function Addresses({ params }: Props) {
  const { countryCode } = await params
  const t = await getTranslations("pages.account.addresses")
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      {customer.addresses.length > 0 && (
        <nav className="flex items-center lg:justify-end max-lg:fixed max-lg:bottom-0 bg-background max-lg:container max-lg:border-t left-0 max-lg:py-4 w-full">
          <AddAddressDialog
            region={region}
            addresses={customer.addresses}
            asChild
          >
            <Button className="w-full lg:w-fit" size="lg">
              {t("add_button")}
            </Button>
          </AddAddressDialog>
        </nav>
      )}
      {customer.addresses.length > 0 && (
        <Separator className="hidden lg:block lg:my-10" />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        {customer.addresses.map((address) => {
          return (
            <AddressCard region={region} address={address} key={address.id} />
          )
        })}
      </div>
      {customer.addresses.length == 0 && (
        <div className="flex flex-col items-center">
          <h1 className="text-center font-semibold text-xl">
            {t("not_found.title")}
          </h1>
          <p className="text-muted-foreground font-medium">
            {t("not_found.description")}
          </p>
          <AddAddressDialog
            region={region}
            addresses={customer.addresses}
            asChild
          >
            <Button className="w-full lg:w-fit mt-5" size="lg">
              {t("add_button")}
            </Button>
          </AddAddressDialog>
        </div>
      )}
    </div>
  )
}
