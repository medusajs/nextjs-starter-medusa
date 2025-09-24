import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { CheckIcon, XIcon } from "lucide-react"

import { retrieveOrder } from "@/utils/data/orders"
import { convertToLocale } from "@/utils/helpers/math"
import { cn } from "@/lib/utils"
import { generateMeta } from "@/utils/meta/generate-meta"

import { LocalizedClientLink } from "@/components/i18n/client-link"
import { LineItemOptions } from "@/components/modules/cart/line-item-options"
import { LineItemPrice } from "@/components/modules/cart/line-item-price"
import { LineItemUnitPrice } from "@/components/modules/cart/line-item-unit-price"
import { Button } from "@/components/ui/primitives/button"
import { Progress } from "@/components/ui/primitives/progress"
import { Separator } from "@/components/ui/primitives/separator"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/primitives/table"
import { CartTotals } from "@/components/features/cart/cart-totals"

type Props = {
  params: Promise<{ id: string; countryCode: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, countryCode } = await params
  const t = await getTranslations("pages.account.order_detail.meta")
  const order = await retrieveOrder(id).catch(() => null)

  if (!order) {
    notFound()
  }

  return generateMeta({
    meta: {
      title: t("title", { number: order.display_id?.toString() || order.id }),
      description: t("description", {
        number: order.display_id?.toString() || order.id,
      }),
    },
    slug: [countryCode, "account", "orders", "details", id],
  })
}

const STATUS_STEPS = ["not_fulfilled", "captured", "fulfilled", "delivered"]

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params
  const order = await retrieveOrder(id).catch(() => null)
  const t = await getTranslations("pages.account.order_detail")

  if (!order) {
    notFound()
  }

  function getCurrentIndex(order: any) {
    if (
      order.fulfillment_status &&
      STATUS_STEPS.includes(order.fulfillment_status)
    ) {
      return STATUS_STEPS.indexOf(
        order.fulfillment_status as (typeof STATUS_STEPS)[number]
      )
    }

    if (order.payment_status === "captured") {
      return STATUS_STEPS.indexOf("captured")
    }

    return -1
  }

  const currentIndex = getCurrentIndex(order)

  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return
    }

    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  return (
    <div className="flex flex-col lg:flex-row items-start gap-5 lg:gap-10 w-full justify-between">
      <div className="flex flex-col justify-center gap-y-4 w-full">
        <div className="flex gap-2 justify-between items-center">
          <h1 className="text-lg lg:text-xl font-bold">
            {t("label.number")}:{" "}
            <span data-testid="order-id">#{order.display_id}</span>
          </h1>
          <LocalizedClientLink
            href="/account/orders"
            data-testid="back-to-overview-button"
            className="hidden lg:block"
          >
            <Button variant="ghost">
              <XIcon /> {t("back_button")}
            </Button>
          </LocalizedClientLink>
        </div>
        <div className="bg-secondary p-6 rounded-xl text-sm text-secondary-foreground">
          <p>{t("label.information_sent", { email: order.email || "" })}</p>
        </div>
        <div
          className={cn("p-6 rounded-xl text-sm", {
            "bg-orange-100 text-orange-700":
              order.payment_status == "awaiting" ||
              order.payment_status == "partially_refunded" ||
              order.payment_status == "authorized",
            "bg-green-100 text-green-700": order.payment_status == "captured",
            "bg-destructive text-destructive-foreground":
              order.payment_status == "refunded" ||
              order.payment_status == "canceled" ||
              order.payment_status == "requires_action" ||
              order.payment_status == "not_paid",
          })}
        >
          <p>
            {t("label.payment_status")}:{" "}
            <span sata-testid="order-payment-status">
              {t(`payment_status.${order.payment_status}`)}
            </span>
          </p>
        </div>
        <Separator className="my-5" />
        <Table>
          <TableCaption>{t("table.message")}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.product_info")}</TableHead>
              <TableHead className="text-right">{t("table.price")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items?.length
              ? order.items
                  .sort((a, b) => {
                    return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                  })
                  .map((item) => (
                    <TableRow key={item.id} data-testid="product-row">
                      <TableCell>
                        <div className="flex items-start gap-4">
                          <Image
                            src={item.product?.thumbnail || ""}
                            width={60}
                            height={60}
                            className="rounded-lg border"
                            alt="Product İmage"
                          />
                          <div className="flex flex-col items-start">
                            {item.product?.title}{" "}
                            <LineItemOptions
                              variant={item.variant}
                              data-testid="product-variant"
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="!pr-0 flex flex-col items-end h-full justify-center">
                          <span className="flex gap-x-1 ">
                            <p className="text-muted-foreground">
                              <span data-testid="product-quantity">
                                {item.quantity}
                              </span>
                              x{" "}
                            </p>
                            <LineItemUnitPrice
                              item={item}
                              style="tight"
                              currencyCode={order.currency_code}
                            />
                          </span>

                          <LineItemPrice
                            item={item}
                            style="tight"
                            currencyCode={order.currency_code}
                          />
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
              : null}
          </TableBody>
        </Table>
        <div className="flex flex-col lg:flex-row items-stretch gap-5 w-full mt-5">
          <div
            className="flex flex-col w-full lg:w-1/3 rounded-xl border bg-background text-sm lg:text-base"
            data-testid="shipping-address-summary"
          >
            <p className="font-medium text-foreground leading-none p-6">
              {t("shipping_details.shipping_address")}
            </p>
            <div className="p-6 bg-secondary rounded-xl">
              <p className="font-medium text-foreground">
                {order.shipping_address?.first_name}{" "}
                {order.shipping_address?.last_name}
              </p>
              <p className="font-medium text-foreground">
                {order.shipping_address?.address_1}{" "}
                {order.shipping_address?.address_2}
              </p>
              <p className="font-medium text-foreground">
                {order.shipping_address?.postal_code},{" "}
                {order.shipping_address?.city}
              </p>
              <p className="font-medium text-foreground">
                {order.shipping_address?.country_code?.toUpperCase()}
              </p>
            </div>
          </div>

          <div
            className="flex flex-col w-full lg:w-1/3 border rounded-xl bg-background text-sm lg:text-base"
            data-testid="shipping-contact-summary"
          >
            <p className="font-medium text-foreground leading-none p-6">
              {t("shipping_details.contact")}
            </p>
            <div className="bg-secondary rounded-xl p-6 h-full">
              <p className="font-medium text-foreground">
                {order.shipping_address?.phone}
              </p>
              <p className="font-medium text-foreground">{order.email}</p>
            </div>
          </div>

          <div
            className="flex flex-col w-full lg:w-1/3 border rounded-xl bg-background text-sm lg:text-base"
            data-testid="shipping-method-summary"
          >
            <p className="font-medium text-foreground leading-none p-6">
              {t("shipping_details.method")}
            </p>
            <p className="font-medium text-foreground p-6 bg-secondary rounded-xl h-full">
              {(order as any).shipping_methods[0]?.name} (
              {convertToLocale({
                amount: order.shipping_methods?.[0].total ?? 0,
                currency_code: order.currency_code,
              })
                .replace(/,/g, "")
                .replace(/\./g, ",")}
              )
            </p>
          </div>
        </div>
        <Separator className="my-5" />
        <CartTotals variant="card" totals={order} />
      </div>
      <div className="flex flex-col items-start bg-background fixed left-0 lg:sticky z-10 w-full lg:w-fit pt-5 lg:pt-0 bottom-0 lg:top-25">
        <div className="flex flex-row max-lg:container lg:flex-col items-stretch justify-between w-full lg:gap-4">
          {STATUS_STEPS.map((step, idx) => {
            const isCanceled = order.fulfillment_status === "canceled"
            return (
              <div
                key={step}
                className="flex-1 flex flex-col lg:flex-row gap-1 lg:gap-2 items-center"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    isCanceled
                      ? "bg-destructive text-destructive-foreground"
                      : idx <= currentIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {idx <= currentIndex ? (
                    <CheckIcon className="size-4 mt-0.5" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs text-center lg:text-start whitespace-nowrap",
                    idx <= currentIndex
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {t(
                    `progress_label.${idx === STATUS_STEPS.length - 1 && isCanceled ? "canceled" : step}`
                  )}
                </span>
              </div>
            )
          })}
        </div>
        <Progress
          value={((currentIndex + 1) / STATUS_STEPS.length) * 100}
          className="lg:hidden mt-4"
        />
      </div>
    </div>
  )
}
