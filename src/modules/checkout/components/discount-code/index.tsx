import { medusaClient } from "@lib/config"
import { Cart } from "@medusajs/medusa"
import Button from "@modules/common/components/button"
import Input from "@modules/common/components/input"
import { formatAmount, useCart, useUpdateCart } from "medusa-react"
import React, { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "react-query"

type DiscountFormValues = {
  discount_code: string
}

type DiscountCodeProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const { id, discounts, region } = cart
  const [show, setShow] = useState(false)
  const { mutate, isLoading } = useUpdateCart(id)
  const { setCart } = useCart()

  const { isLoading: mutationLoading, mutate: removeDiscount } = useMutation(
    (payload: { cartId: string; code: string }) => {
      return medusaClient.carts.deleteDiscount(payload.cartId, payload.code)
    }
  )

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
        return "Free shipping"
    }
  }, [discounts, region])

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DiscountFormValues>({
    mode: "onSubmit",
  })

  const onApply = (data: DiscountFormValues) => {
    mutate(
      {
        discounts: [{ code: data.discount_code }],
      },
      {
        onSuccess: ({ cart }) => setCart(cart),
        onError: () => {
          setError(
            "discount_code",
            {
              message: "Code is invalid",
            },
            {
              shouldFocus: true,
            }
          )
        },
      }
    )
  }

  const onRemove = () => {
    removeDiscount(
      { cartId: id, code: discounts[0].code },
      {
        onSuccess: ({ cart }) => {
          setCart(cart)
        },
      }
    )
  }

  return (
    <div className="w-full bg-white p-6 flex flex-col">
      <div className="mb-4">
        <h3 className="text-base-semi">Discount</h3>
      </div>
      <div className="text-small-regular">
        {appliedDiscount ? (
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <div>
              <span>{appliedDiscount}</span>
              <button className="underline" onClick={onRemove}>
                Remove
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onApply)} className="w-full">
            <div className="grid grid-cols-[1fr_80px] gap-x-2">
              <Input
                label="Code"
                {...register("discount_code", {
                  required: "Code is required",
                })}
                errors={errors}
              />
              <div>
                <Button className="!min-h-[0] h-[46px] w-[80px]">Apply</Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default DiscountCode
