"use client"

import React, { Fragment } from "react"
import { useTranslations } from "next-intl"
import { TrashIcon } from "lucide-react"

import { applyPromotions } from "@/utils/data/cart"
import { convertToLocale } from "@/utils/helpers/math"
import { cn } from "@/lib/utils"

import { SubmitButton } from "@/components/ui/forms/submit-button"
import { ErrorMessage } from "@/components/ui/forms/error-message"
import { Label } from "@/components/ui/primitives/label"
import { Input } from "@/components/ui/primitives/input"
import { Badge } from "@/components/ui/primitives/badge"
import { Button } from "@/components/ui/primitives/button"

import type { HttpTypes } from "@medusajs/types"

type Props = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function DiscountCode({ cart }: Props) {
  const t = useTranslations("modules.cart.discount_code")
  const [isOpen, setIsOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const { promotions = [] } = cart
  const removePromotionCode = async (code: string) => {
    const validPromotions = promotions.filter(
      (promotion) => promotion.code !== code
    )

    await applyPromotions(
      validPromotions.filter((p) => p.code === undefined).map((p) => p.code!)
    )
  }

  const addPromotionCode = async (formData: FormData) => {
    setErrorMessage("")

    const code = formData.get("code")
    if (!code) {
      return
    }
    const input = document.getElementById("promotion-input") as HTMLInputElement
    const codes = promotions
      .filter((p) => p.code === undefined)
      .map((p) => p.code!)
    codes.push(code.toString())

    try {
      await applyPromotions(codes)
    } catch {
      setErrorMessage(t("error"))
    }

    if (input) {
      input.value = ""
    }
  }

  return (
    <div className="w-full flex flex-col">
      <div className="font-medium">
        <form
          action={(a) => addPromotionCode(a)}
          className={cn("w-full", promotions.length > 0 ? "mb-5" : "")}
        >
          <Label className="flex gap-x-1 my-2 items-center">
            <Button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              variant="link"
              size="clear"
              data-testid="add-discount-button"
            >
              {t("add")}
            </Button>

            {/* <Tooltip content="You can add multiple promotion codes">
              <InformationCircleSolid color="var(--fg-muted)" />
            </Tooltip> */}
          </Label>

          {isOpen && (
            <Fragment>
              <div className="flex w-full gap-x-2">
                <Input
                  className="size-full"
                  id="promotion-input"
                  name="code"
                  type="text"
                  size="lg"
                  autoFocus={false}
                  placeholder="3X-ABC123"
                  data-testid="discount-input"
                />
                <SubmitButton data-testid="discount-apply-button">
                  {t("apply")}
                </SubmitButton>
              </div>

              <ErrorMessage
                error={errorMessage}
                data-testid="discount-error-message"
              />
            </Fragment>
          )}
        </form>

        {promotions.length > 0 && (
          <div className="w-full flex items-center">
            <div className="flex flex-col w-full">
              <h6 className="font-medium mb-2">{t("applied_promotions")}</h6>

              {promotions.map((promotion) => {
                return (
                  <div
                    key={promotion.id}
                    className="flex items-center justify-between w-full max-w-full mb-2"
                    data-testid="discount-row"
                  >
                    <p className="flex gap-x-1 items-baseline txt-small-plus w-4/5 pr-1">
                      <span className="truncate" data-testid="discount-code">
                        <Badge
                          color={promotion.is_automatic ? "green" : "grey"}
                        >
                          {promotion.code}
                        </Badge>{" "}
                        (
                        {promotion.application_method?.value !== undefined &&
                          promotion.application_method.currency_code !==
                            undefined &&
                          (promotion.application_method.type === "percentage"
                            ? `${promotion.application_method.value}%`
                            : convertToLocale({
                                amount: parseInt(
                                  promotion.application_method.value
                                ),
                                currency_code:
                                  promotion.application_method.currency_code,
                              }))}
                        )
                        {/* {promotion.is_automatic && (
                          <Tooltip content="This promotion is automatically applied">
                            <InformationCircleSolid className="inline text-zinc-400" />
                          </Tooltip>
                        )} */}
                      </span>
                    </p>
                    {!promotion.is_automatic && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          if (!promotion.code) {
                            return
                          }
                          removePromotionCode(promotion.code)
                        }}
                        data-testid="remove-discount-button"
                      >
                        <TrashIcon size={14} />
                        <span className="sr-only">{t("remove")}</span>
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { DiscountCode }
export type { Props as DiscountCodeProps }
