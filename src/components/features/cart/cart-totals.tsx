"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { convertToLocale } from "@/utils/helpers/math"

type Props = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    shipping_total?: number | null
    discount_total?: number | null
    gift_card_total?: number | null
    currency_code: string
    shipping_subtotal?: number | null
  }
  variant?: "list" | "card"
}

function CartTotals({ totals, variant = "list" }: Props) {
  const t = useTranslations("features.cart.cart_totals")
  const {
    currency_code,
    total,
    subtotal,
    tax_total,
    discount_total,
    gift_card_total,
    shipping_subtotal,
  } = totals

  if (variant == "list") {
    return (
      <div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex gap-x-1 items-center">{t("subtotal")}</span>
          <span data-testid="cart-subtotal" data-value={subtotal || 0}>
            {convertToLocale({ amount: subtotal ?? 0, currency_code })}
          </span>
        </div>
        {!!discount_total && (
          <div className="flex items-center justify-between text-sm">
            <span>{t("discount")}</span>
            <span
              className="text-primary"
              data-testid="cart-discount"
              data-value={discount_total || 0}
            >
              -{" "}
              {convertToLocale({ amount: discount_total ?? 0, currency_code })}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span>{t("shipping")}</span>
          <span data-testid="cart-shipping" data-value={shipping_subtotal || 0}>
            {convertToLocale({ amount: shipping_subtotal ?? 0, currency_code })}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="flex gap-x-1 items-center ">{t("taxes")}</span>
          <span data-testid="cart-taxes" data-value={tax_total || 0}>
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </span>
        </div>
        {!!gift_card_total && (
          <div className="flex items-center justify-between text-sm">
            <span>{t("gift_card")}</span>
            <span
              className="text-primary"
              data-testid="cart-gift-card-amount"
              data-value={gift_card_total || 0}
            >
              -{" "}
              {convertToLocale({ amount: gift_card_total ?? 0, currency_code })}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-foreground font-medium mt-4">
          <span>{t("total")}</span>
          <span data-testid="cart-total" data-value={total || 0}>
            {convertToLocale({ amount: total ?? 0, currency_code })}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-xl">
      <div className="flex flex-col gap-y-2 font-medium text-foreground p-6">
        <div className="flex items-center justify-between">
          <span className="flex gap-x-1 items-center">{t("subtotal")}</span>
          <span data-testid="cart-subtotal" data-value={subtotal || 0}>
            {convertToLocale({ amount: subtotal ?? 0, currency_code })}
          </span>
        </div>
        {!!discount_total && (
          <div className="flex items-center justify-between text-sm">
            <span>{t("discount")}</span>
            <span
              className="text-primary"
              data-testid="cart-discount"
              data-value={discount_total || 0}
            >
              -{" "}
              {convertToLocale({ amount: discount_total ?? 0, currency_code })}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span>{t("shipping")}</span>
          <span data-testid="cart-shipping" data-value={shipping_subtotal || 0}>
            {convertToLocale({ amount: shipping_subtotal ?? 0, currency_code })}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="flex gap-x-1 items-center ">{t("taxes")}</span>
          <span data-testid="cart-taxes" data-value={tax_total || 0}>
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </span>
        </div>
        {!!gift_card_total && (
          <div className="flex items-center justify-between text-sm">
            <span>{t("gift_card")}</span>
            <span
              className="text-primary"
              data-testid="cart-gift-card-amount"
              data-value={gift_card_total || 0}
            >
              -{" "}
              {convertToLocale({ amount: gift_card_total ?? 0, currency_code })}
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between text-foreground p-6 rounded-xl font-medium bg-secondary">
        <span>{t("total")}</span>
        <span data-testid="cart-total" data-value={total || 0}>
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>
    </div>
  )
}

export { CartTotals }
export type { Props as CartTotalsProps }
