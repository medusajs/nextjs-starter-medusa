import { Cart } from "@medusajs/medusa"
import Button from "@modules/common/components/button"
import Input from "@modules/common/components/input"
import { useCart } from "medusa-react"
import React, { useMemo } from "react"
import { useForm } from "react-hook-form"

type GiftCardFormValues = {
  gift_card_code: string
}

type GiftCardProps = {
  cart?: Omit<Cart, "refundable_amount" | "refunded_total">
}

const GiftCard: React.FC<GiftCardProps> = ({ cart }) => {
  const {
    updateCart: { mutate, isLoading },
    setCart,
  } = useCart()

  const {
    register,
    handleSubmit,
    formState: { touchedFields, errors },
    setError,
  } = useForm<GiftCardFormValues>()

  const appliedDiscount = useMemo(() => {
    if (!cart || !cart.gift_cards?.length) {
      return undefined
    }

    return cart.gift_cards[0].code
  }, [cart])

  const onSubmit = (data: GiftCardFormValues) => {
    mutate(
      {
        gift_cards: [{ code: data.gift_card_code }],
      },
      {
        onSuccess: ({ cart }) => setCart(cart),
        onError: () => {
          setError(
            "gift_card_code",
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
    mutate(
      {
        gift_cards: [],
      },
      {
        onSuccess: ({ cart }) => setCart(cart),
      }
    )
  }

  if (cart?.gift_cards.length) {
    return (
      <div>
        <div></div>
      </div>
    )
  }

  return (
    <div className="w-full bg-white p-6 flex flex-col">
      <div className="mb-4">
        <h3 className="text-base-semi">Gift Card</h3>
      </div>
      <div className="text-small-regular">
        {appliedDiscount ? (
          <div className="flex items-center justify-between">
            <span>Code</span>
            <div>
              <span>{appliedDiscount}</span>
              <button className="underline" onClick={onRemove}>
                Remove
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="grid grid-cols-[1fr_80px] gap-x-2">
              <Input
                label="Code"
                {...register("gift_card_code", {
                  required: "Code is required",
                })}
                errors={errors}
                touched={touchedFields}
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

export default GiftCard
