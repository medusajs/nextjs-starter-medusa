import { ErrorMessage } from "@hookform/error-message"
import { Cart } from "@medusajs/medusa"
import Plus from "@modules/common/icons/plus"
import Spinner from "@modules/common/icons/spinner"
import { formatAmount, useCart, useUpdateCart } from "medusa-react"
import React, { useState } from "react"
import { useForm } from "react-hook-form"

type DiscountFormValues = {
  discount_code: string
}

type DiscountCodeProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const { id, discounts } = cart
  const [show, setShow] = useState(false)
  const { mutate, isLoading } = useUpdateCart(id)
  const { setCart } = useCart()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DiscountFormValues>()

  const onSubmit = (data: DiscountFormValues) => {
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
              message: "Discount code is invalid",
            },
            {
              shouldFocus: true,
            }
          )
        },
      }
    )
  }

  if (discounts.length) {
    let value

    switch (discounts[0].rule.type) {
      case "percentage":
        value = `${discounts[0].rule.value}%`
        break
      case "fixed":
        value = `- ${formatAmount({
          amount: discounts[0].rule.value,
          region: cart.region,
        })}`
        break
      default:
        value = "Free shipping"
        break
    }

    return (
      <div className="flex items-center justify-between text-small-regular">
        <span className="text-small-regular text-gray-700">
          Promotional code
        </span>
        <span>
          {discounts[0].code} <span>({value})</span>
        </span>
      </div>
    )
  }

  return (
    <div className="text-small-regular">
      {!show ? (
        <div className="flex items-center justify-between">
          <span>Promotional code?</span>
          <button className="underline" onClick={() => setShow(true)}>
            Add code
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center gap-x-4 border-gray-200 border">
            <input
              {...register("discount_code", {
                required: "Discount code is required",
              })}
              placeholder="Enter code"
              className="w-full p-2 outline-none focus:border-gray-400 transition-colors duration-200 text-small-regular"
            />
            <button
              className="underline text-right px-2"
              onClick={() => setShow(true)}
            >
              {isLoading ? <Spinner /> : <Plus />}
            </button>
          </div>
          <ErrorMessage
            errors={errors}
            name="discount_code"
            render={(error) => {
              return (
                <div className="my-2">
                  <span className="text-small-regular text-rose-500">
                    {error.message}
                  </span>
                </div>
              )
            }}
          />
        </form>
      )}
    </div>
  )
}

export default DiscountCode
