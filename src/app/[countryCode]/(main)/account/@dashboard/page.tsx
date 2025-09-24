import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { ChevronDownIcon } from "lucide-react"

import { retrieveCustomer } from "@/utils/data/customer"
import { listOrders } from "@/utils/data/orders"
import { convertToLocale } from "@/utils/helpers/math"
import { generateMeta } from "@/utils/meta/generate-meta"

import { LocalizedClientLink } from "@/components/i18n/client-link"
import { Card, CardContent } from "@/components/ui/primitives/card"
import { Separator } from "@/components/ui/primitives/separator"
import { Avatar, AvatarFallback } from "@/components/ui/primitives/avatar"

import type { HttpTypes } from "@medusajs/types"

type Props = {
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata({ params }: Props) {
  const { countryCode } = await params
  const t = await getTranslations("pages.account.overview.meta")

  return generateMeta({
    meta: {
      title: t("title"),
      description: t("description"),
    },
    slug: [countryCode, "account"],
  })
}

export default async function OverviewPage() {
  const customer = await retrieveCustomer().catch(() => null)
  const orders = (await listOrders().catch(() => null)) || null
  const t = await getTranslations("pages.account.overview")

  if (!customer) {
    notFound()
  }

  function getProfileCompletion(customer: HttpTypes.StoreCustomer) {
    let count = 0

    if (!customer) {
      return 0
    }

    if (customer.email) {
      count++
    }

    if (customer.first_name && customer.last_name) {
      count++
    }

    if (customer.phone) {
      count++
    }

    const billingAddress = customer.addresses?.find(
      (addr) => addr.is_default_billing
    )

    if (billingAddress) {
      count++
    }

    return (count / 4) * 100
  }

  return (
    <div data-testid="overview-page-wrapper">
      <div className="hidden lg:block">
        <div className="flex items-start gap-2">
          <Avatar className="size-12 font-medium">
            <AvatarFallback>{customer.first_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="font-bold">
              {customer.first_name} {customer.last_name}
            </span>
            <u className="underline-offset-4 text-sm">{t("label.profile")}</u>
          </div>
        </div>
        <Separator className="my-5" />
        <div className="flex items-center justify-around mb-6 py-6 bg-secondary rounded-xl">
          <div className="flex flex-col items-center">
            <span
              className="text-xl font-bold leading-none"
              data-testid="customer-profile-completion"
              data-value={getProfileCompletion(customer)}
            >
              {getProfileCompletion(customer)}%
            </span>
            <h3 className="text-base mt-1 text-center">
              {t("label.profile_completing")}
            </h3>
          </div>

          <Separator orientation="vertical" className="!h-14" />

          <div className="flex flex-col items-center">
            <span
              className="text-xl font-bold leading-none"
              data-testid="addresses-count"
              data-value={customer?.addresses?.length || 0}
            >
              {customer?.addresses?.length || 0}
            </span>
            <h3 className="text-base mt-1 text-center">
              {t("label.address_count")}
            </h3>
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <div className="flex items-center gap-x-2">
            <h3 className="text-lg font-medium">{t("label.recent_orders")}</h3>
          </div>
          <ul className="flex flex-col gap-y-4" data-testid="orders-wrapper">
            {orders && orders.length > 0 ? (
              orders.slice(0, 5).map((order) => {
                return (
                  <li
                    key={order.id}
                    data-testid="order-wrapper"
                    data-value={order.id}
                  >
                    <LocalizedClientLink
                      href={`/account/orders/details/${order.id}`}
                      className="group/card"
                    >
                      <Card className="data-[variant=default]:hover:bg-accent">
                        <CardContent className="flex justify-between items-center w-full">
                          <div className="grid grid-cols-3 grid-rows-2 text-sm gap-x-4 flex-1">
                            <span className="font-semibold">
                              {t("item.order.date")}
                            </span>
                            <span className="font-semibold">
                              {t("item.order.number")}
                            </span>
                            <span className="font-semibold">
                              {t("item.order.total_amount")}
                            </span>
                            <span data-testid="order-created-date">
                              {new Date(order.created_at).toDateString()}
                            </span>
                            <span
                              data-testid="order-id"
                              data-value={order.display_id}
                            >
                              #{order.display_id}
                            </span>
                            <span data-testid="order-amount">
                              {convertToLocale({
                                amount: order.total,
                                currency_code: order.currency_code,
                              })}
                            </span>
                          </div>
                          <button
                            className="flex items-center justify-between"
                            data-testid="open-order-button"
                          >
                            <span className="sr-only">
                              Go to order #{order.display_id}
                            </span>
                            <ChevronDownIcon className="-rotate-90 size-4 group-hover/card:translate-x-2 transition-transform" />
                          </button>
                        </CardContent>
                      </Card>
                    </LocalizedClientLink>
                  </li>
                )
              })
            ) : (
              <span
                data-testid="no-orders-message"
                className="justify-center w-full bg-secondary p-6 text-center"
              >
                {t("message.no_recent_order")}
              </span>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
