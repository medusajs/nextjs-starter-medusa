import { useMemo } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { ChevronRightIcon } from "lucide-react"

import { convertToLocale } from "@/utils/helpers/math"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/primitives/carousel"
import { Button } from "@/components/ui/primitives/button"
import { LocalizedClientLink } from "@/components/i18n/client-link"

import type { HttpTypes } from "@medusajs/types"
import { cn } from "@/lib/utils"

type Props = {
  order: HttpTypes.StoreOrder
}

function OrderCard({ order }: Props) {
  const t = useTranslations("features.account.cards.order_card")

  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity
      }, 0) ?? 0
    )
  }, [order])

  return (
    <div
      className={cn("flex flex-col w-full border rounded-xl", {
        "bg-orange-100": order.fulfillment_status == "not_fulfilled",
        "bg-green-100":
          order.fulfillment_status == "fulfilled" ||
          order.fulfillment_status == "shipped" ||
          order.fulfillment_status == "delivered",
        "bg-red-100": order.fulfillment_status == "canceled",
        "bg-gradient-to-r from-green-100 to-orange-100":
          order.fulfillment_status == "partially_fulfilled" ||
          order.fulfillment_status == "partially_shipped" ||
          order.fulfillment_status == "partially_delivered",
      })}
      data-testid="order-card"
    >
      <div className="flex flex-col lg:flex-row items-start gap-3 lg:items-center p-6 justify-between">
        <div className="flex flex-col">
          <div className="uppercase text-lg font-medium">
            #<span data-testid="order-display-id">{order.display_id}</span>
          </div>
          <div className="flex items-center divide-x divide-white text-sm text-foreground">
            <span className="pr-2" data-testid="order-created-at">
              {new Date(order.created_at).toDateString()}
            </span>
            <span className="px-2" data-testid="order-amount">
              {convertToLocale({
                amount: order.total,
                currency_code: order.currency_code,
              })}
            </span>
            <span className="px-2 hidden lg:block">
              {t(`fulfilled_status.${order.fulfillment_status}`)}
            </span>
            <span className="pl-2">
              {t("item_count", { count: numberOfLines })}
            </span>
          </div>
        </div>
        <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
          <Button data-testid="order-details-link" variant="secondary">
            {t("detail_button")} <ChevronRightIcon />
          </Button>
        </LocalizedClientLink>
      </div>
      <div className="flex flex-col bg-secondary rounded-xl w-full border-t p-6">
        <Carousel className="w-full">
          <CarouselContent className="w-full">
            {order.items?.map((i) => (
              <CarouselItem
                key={i.id}
                data-testid="order-item"
                className="basis-1/2 sm:basis-1/4"
              >
                <div className="flex flex-col gap-y-2">
                  <Image
                    src={i.thumbnail || ""}
                    alt={i.product_title || ""}
                    width={200}
                    height={300}
                    className="border rounded-lg"
                  />
                  <div className="flex items-center text-sm text-foreground">
                    <span
                      className="text-foreground font-semibold"
                      data-testid="item-title"
                    >
                      {i.title}
                    </span>
                    <span className="ml-2">x</span>
                    <span data-testid="item-quantity">{i.quantity}</span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}

export { OrderCard }
