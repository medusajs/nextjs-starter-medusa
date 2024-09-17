"use client"

import { InformationCircleSolid } from "@medusajs/icons"
import { Cart } from "@medusajs/medusa"
import { Heading, Label, Text, Tooltip } from "@medusajs/ui"
import React, { useMemo } from "react"
import { useFormState } from "react-dom"

import { useI18n } from '../../../../locales/client'

import Input from "@modules/common/components/input"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import {
  removeDiscount,
  removeGiftCard,
  submitDiscountForm,
} from "@modules/checkout/actions"
import { formatAmount } from "@lib/util/prices"

type DiscountCodeProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const t = useI18n()
  const [isOpen, setIsOpen] = React.useState(false)

  const { discounts, gift_cards, region } = cart

  const appliedDiscount = useMemo(() => {
    if (!discounts || !discounts.length) {
      return undefined
    }

    switch (discounts[0].rule.type) {
      case "percentage":
        return `${discounts[0].rule.value}%`
      case "fixed":
        return `- ${formatAmount({
          amount: discounts[0].rule.value,
          region: region,
        })}`

      default:
        return t("checkout.shipping.free")
    }
  }, [discounts, region])

  const removeGiftCardCode = async (code: string) => {
    await removeGiftCard(code, gift_cards)
  }

  const removeDiscountCode = async () => {
    await removeDiscount(discounts[0].code)
  }

  const [message, formAction] = useFormState(submitDiscountForm, null)

  return (
    <div className="w-full bg-white flex flex-col">
      <div className="txt-medium">
        {gift_cards.length > 0 && (
          <div className="flex flex-col mb-4">
            <Heading className="txt-medium">{t("checkout.giftcards")}</Heading>
            {gift_cards?.map((gc) => (
              <div
                className="flex items-center justify-between txt-small-plus"
                key={gc.id}
                data-testid="gift-card"
              >
                <Text className="flex gap-x-1 items-baseline">
                  <span>{t("checkout.code")}</span>
                  <span className="truncate" data-testid="gift-card-code">
                    {gc.code}
                  </span>
                </Text>
                <Text
                  className="font-semibold"
                  data-testid="gift-card-amount"
                  data-value={gc.balance}
                >
                  {formatAmount({
                    region: region,
                    amount: gc.balance,
                    includeTaxes: false,
                  })}
                </Text>
                <button
                  className="flex items-center gap-x-2 !background-transparent !border-none"
                  onClick={() => removeGiftCardCode(gc.code)}
                  data-testid="remove-gift-card-button"
                >
                  <Trash size={14} />
                  <span className="sr-only">{t("checkout.removegift")}</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {appliedDiscount ? (
          <div className="w-full flex items-center">
            <div className="flex flex-col w-full">
              <Heading className="txt-medium">{t("checkout.discount")}</Heading>
              <div
                className="flex items-center justify-between w-full max-w-full"
                data-testid="discount-row"
              >
                <Text className="flex gap-x-1 items-baseline txt-small-plus w-4/5 pr-1">
                  <span>{t("checkout.code")}</span>
                  <span className="truncate" data-testid="discount-code">
                    {discounts[0].code}
                  </span>
                  <span
                    className="min-w-fit"
                    data-testid="discount-amount"
                    data-value={discounts[0].rule.value}
                  >
                    ({appliedDiscount})
                  </span>
                </Text>
                <button
                  className="flex items-center"
                  onClick={removeDiscountCode}
                  data-testid="remove-discount-button"
                >
                  <Trash size={14} />
                  <span className="sr-only">
                  {t("checkout.removediscount")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form action={formAction} className="w-full">
            <Label className="flex gap-x-1 my-2 items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="txt-medium text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                data-testid="add-discount-button"
              >
                {t("checkout.addgift")}
              </button>
              <Tooltip content="You can add multiple gift cards, but only one discount code.">
                <InformationCircleSolid color="var(--fg-muted)" />
              </Tooltip>
            </Label>
            {isOpen && (
              <>
                <div className="flex w-full gap-x-2 items-center">
                  <Input
                    label={t("checkout.entercode")}
                    name="code"
                    type="text"
                    autoFocus={false}
                    data-testid="discount-input"
                  />
                  <SubmitButton
                    variant="secondary"
                    data-testid="discount-apply-button"
                  >
                    {t("generic.apply")}
                  </SubmitButton>
                </div>
                <ErrorMessage
                  error={message}
                  data-testid="discount-error-message"
                />
              </>
            )}
          </form>
        )}
      </div>
    </div>
  )
}

export default DiscountCode
