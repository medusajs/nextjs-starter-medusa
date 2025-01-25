import k from "@lib/i18n/translations/keys"
import { getTranslations } from "next-intl/server"

import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"

import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Addresses",
  description: "View your addresses",
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)
  const t = await getTranslations()

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">{t(k.SHIPPING_ADDRESSES)}</h1>
        <p className="text-base-regular">
          {t(k.VIEW_AND_UPDATE_YOUR_SHIPPING)}
        </p>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
