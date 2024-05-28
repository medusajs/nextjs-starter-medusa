"use client"

import { Badge, Heading, Input, Label, Text, Tooltip } from "@medusajs/ui"
import React from "react"
import { useFormState } from "react-dom"

import { applyPromotions, submitPromotionForm } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { InformationCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const { items = [], promotions = [] } = cart
  const removePromotionCode = async (code) => {
    const validPromotions = promotions.filter(
      (promotion) => promotion.code !== code
    )

    await applyPromotions(validPromotions.map((p) => p.code))
  }

  const addPromotionCode = async (formData) => {
    const code = formData.get("code")
    const input = document.getElementById("promotion-input")
    const codes = promotions.map((p) => p.code)
    codes.push(code)

    await applyPromotions(codes)

    if (input) {
      input.value = ""
    }
  }

  const [message, formAction] = useFormState(submitPromotionForm, null)

  return (
    <div className="w-full bg-white flex flex-col">
      <div className="txt-medium">
        <form action={(a, b) => addPromotionCode(a, b)} className="w-full mb-5">
          <Label className="flex gap-x-1 my-2 items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="txt-medium text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="add-discount-button"
            >
              Add Promotion Code(s)
            </button>

            <Tooltip content="You can add multiple promotion codes">
              <InformationCircleSolid color="var(--fg-muted)" />
            </Tooltip>
          </Label>

          {isOpen && (
            <>
              <div className="flex w-full gap-x-2">
                <Input
                  id="promotion-input"
                  name="code"
                  type="text"
                  autoFocus={false}
                  data-testid="discount-input"
                />
                <SubmitButton
                  variant="secondary"
                  data-testid="discount-apply-button"
                >
                  Apply
                </SubmitButton>
              </div>

              <ErrorMessage
                error={message}
                data-testid="discount-error-message"
              />
            </>
          )}
        </form>

        {promotions.length > 0 && (
          <div className="w-full flex items-center">
            <div className="flex flex-col w-full">
              <Heading className="txt-medium mb-2">
                Promotion(s) applied:
              </Heading>

              {promotions.map((promotion) => {
                return (
                  <div
                    key={promotion.id}
                    className="flex items-center justify-between w-full max-w-full mb-2"
                    data-testid="discount-row"
                  >
                    <Text className="flex gap-x-1 items-baseline txt-small-plus w-4/5 pr-1">
                      <span className="truncate" data-testid="discount-code">
                        <Badge
                          color={promotion.is_automatic ? "green" : "grey"}
                          size="small"
                        >
                          {promotion.code}
                        </Badge>{" "}
                        (
                        {promotion.application_method.type === "percentage"
                          ? `${promotion.application_method.value}%`
                          : convertToLocale({
                              amount: promotion.application_method.value,
                              currency_code:
                                promotion.application_method.currency_code,
                            })}
                        )
                        {promotion.is_automatic && (
                          <Tooltip content="This promotion is automatically applied">
                            <InformationCircleSolid className="inline text-zinc-400" />
                          </Tooltip>
                        )}
                      </span>
                    </Text>
                    {!promotion.is_automatic && (
                      <button
                        className="flex items-center"
                        onClick={() => removePromotionCode(promotion.code)}
                        data-testid="remove-discount-button"
                      >
                        <Trash size={14} />
                        <span className="sr-only">
                          Remove discount code from order
                        </span>
                      </button>
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

export default DiscountCode
