"use client"

import { Fragment } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { convertToLocale } from "@/utils/helpers/math"

import { LocalizedClientLink } from "@/components/i18n/client-link"
import { Button } from "@/components/ui/primitives/button"
import { Separator } from "@/components/ui/primitives/separator"
import { Container } from "@/components/ui/react/design-system"
import { LineItemPrice } from "@/components/modules/cart/line-item-price"
import { DeleteButton } from "@/components/modules/cart/delete-button"
import { ScrollArea } from "@/components/ui/primitives/scroll-area"

import type { HttpTypes } from "@medusajs/types"
import { LineItemOptions } from "@/components/modules/cart/line-item-options"

function CartSidebar({ cart }: { cart: HttpTypes.StoreCart | null }) {
  const t = useTranslations("layout.cart.cart_sidebar")
  const pathname = usePathname()

  const isActive =
    cart &&
    cart.items?.length &&
    !pathname.includes("/cart") &&
    pathname !== "/"

  const totalItems =
    cart?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cart?.subtotal ?? 0

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-l items-start sticky top-0 w-full max-w-72 h-screen bg-background transition-all z-50",
        isActive
          ? "opacity-100 pointer-events-auto w-86"
          : "opacity-0 pointer-events-none w-0"
      )}
    >
      {isActive ? (
        <Fragment>
          <Container>
            <div className="flex items-center justify-between w-full h-16">
              <span className="text-foreground font-semibold">
                {t("label.subtotal")}:
              </span>
              <span
                className="text-base font-medium"
                data-testid="cart-subtotal"
                data-value={subtotal}
              >
                {convertToLocale({
                  amount: subtotal,
                  currency_code: cart.currency_code,
                })}
              </span>
            </div>
            <LocalizedClientLink href="/cart" passHref>
              <Button
                className="w-full mb-4"
                size="lg"
                variant="outline"
                data-testid="go-to-cart-button"
              >
                {t("button.cart", { item_count: totalItems })}
              </Button>
            </LocalizedClientLink>
            <LocalizedClientLink href="/checkout?step=address" passHref>
              <Button
                className="w-full"
                size="lg"
                data-testid="go-to-cart-button"
              >
                {t("button.checkout")}
              </Button>
            </LocalizedClientLink>
          </Container>
          <Separator className="mt-8" />
          <ScrollArea className="max-h-[calc(100vh-192px)] w-full">
            <Container>
              <p className="font-semibold my-4">{t("label.summary")}</p>
              <div className="pb-8 grid grid-cols-1 gap-6">
                {cart.items
                  ?.sort((a, b) => {
                    return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                  })
                  .map((item) => (
                    <div
                      key={item.id}
                      data-testid="cart-item"
                      className="flex flex-col items-start relative"
                    >
                      <div className="flex items-stretch gap-4 mb-2">
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                        >
                          <Image
                            src={item.thumbnail || ""}
                            alt={item.title}
                            width={80}
                            height={80}
                            className="object-cover border rounded-lg w-18 h-18 hover:contrast-[0.9] transition-all"
                          />
                        </LocalizedClientLink>
                        <div className="flex flex-col items-start h-full justify-between">
                          <h3 className="text-base leading-4.5 line-clamp-2 break-all">
                            <LocalizedClientLink
                              href={`/products/${item.product_handle}`}
                              data-testid="product-link"
                            >
                              {item.title}
                            </LocalizedClientLink>
                          </h3>
                          <div className="flex flex-col items-start">
                            <LineItemOptions variant={item.variant} />
                            <span
                              data-testid="cart-item-quantity"
                              className="inline-block font-medium text-muted-foreground text-sm w-full overflow-hidden text-ellipsis"
                              data-value={item.quantity}
                            >
                              {t("label.quantity")}:{" "}
                              <span className="text-foreground">
                                {item.quantity}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <LineItemPrice
                        item={item}
                        currencyCode={cart.currency_code}
                      />
                      <DeleteButton
                        id={item.id}
                        className="absolute -right-1 -bottom-0.5"
                        data-testid="cart-item-remove-button"
                      />
                    </div>
                  ))}
              </div>
            </Container>
          </ScrollArea>
        </Fragment>
      ) : null}
    </aside>
  )
}

export { CartSidebar }
