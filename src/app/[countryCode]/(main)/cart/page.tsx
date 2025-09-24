import { Fragment } from "react"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { retrieveCart } from "@/utils/data/cart"
import { retrieveCustomer } from "@/utils/data/customer"
import { generateMeta } from "@/utils/meta/generate-meta"
import { repeat } from "@/lib/utils"

import { Separator } from "@/components/ui/primitives/separator"
import { LocalizedClientLink } from "@/components/i18n/client-link"
import { Button } from "@/components/ui/primitives/button"
import { Container } from "@/components/ui/react/design-system"
import { DiscountCode } from "@/components/modules/cart/discount-code"
import { CartTotals } from "@/components/features/cart/cart-totals"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/primitives/table"
import { CartItem } from "@/components/features/cart/cart-item"

import type { HttpTypes } from "@medusajs/types"

type Props = {
  params: Promise<{ countryCode: string }>
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

export async function generateMetadata({ params }: Props) {
  const t = await getTranslations("pages.cart.meta")
  const { countryCode } = await params

  return generateMeta({
    meta: {
      title: t("title"),
      description: t("description"),
    },
    slug: [countryCode, "cart"],
  })
}

export default async function Cart() {
  const t = await getTranslations("pages.cart")

  const cart = (await retrieveCart().catch((error) => {
    console.error(error)
    return notFound()
  })) as HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }

  const customer = await retrieveCustomer()

  if (!cart || cart?.items?.length === 0) {
    return notFound()
  }

  const step = getCheckoutStep(cart)

  return (
    <Container data-testid="cart-container">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] items-start gap-20 w-full my-10">
        {!customer && (
          <Fragment>
            <div className="bg-background flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">
                  {t("sign_in_prompt.title")}
                </h2>
                <p className="text-sm text-foreground">
                  {t("sign_in_prompt.description")}
                </p>
              </div>
              <div>
                <LocalizedClientLink href="/account">
                  <Button
                    variant="secondary"
                    className="h-10"
                    data-testid="sign-in-button"
                  >
                    {t("sign_in_prompt.button")}
                  </Button>
                </LocalizedClientLink>
              </div>
            </div>
            <Separator />
          </Fragment>
        )}
        <Table>
          <TableCaption>{t("table.message")}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.product_info")}</TableHead>
              <TableHead></TableHead>
              <TableHead>{t("table.quantity")}</TableHead>
              <TableHead className="hidden lg:table-cell">
                {t("table.price")}
              </TableHead>
              <TableHead className="text-right">{t("table.total")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.items
              ? cart.items
                  .sort((a, b) => {
                    return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                  })
                  .map((item) => {
                    return (
                      <CartItem
                        key={item.id}
                        item={item}
                        currencyCode={cart?.currency_code}
                      />
                    )
                  })
              : repeat(5).map((i) => {
                  return (
                    <TableRow key={i} className="w-full">
                      <TableCell className="w-24">
                        <div className="flex w-24 h-24 p-4 bg-muted rounded-large animate-pulse" />
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex flex-col gap-y-2">
                          <div className="w-32 h-4 bg-muted animate-pulse" />
                          <div className="w-24 h-4 bg-muted animate-pulse" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 items-center">
                          <div className="w-6 h-8 bg-muted animate-pulse" />
                          <div className="w-14 h-10 bg-muted animate-pulse" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <div className="w-12 h-6 bg-muted animate-pulse" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <div className="w-12 h-6 bg-muted animate-pulse" />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
          </TableBody>
        </Table>
        <aside className="flex flex-col gap-y-4 bg-secondary rounded-xl p-6 sticky top-10">
          <h2 className="text-xl">{t("label.summary")}</h2>
          <DiscountCode cart={cart} />
          <Separator />
          <CartTotals totals={cart} />
          <Separator />
          <LocalizedClientLink
            href={"/checkout?step=" + step}
            data-testid="checkout-button"
          >
            <Button size="lg" variant="default" className="w-full">
              {t("checkout_button")}
            </Button>
          </LocalizedClientLink>
        </aside>
      </div>
    </Container>
  )
}
