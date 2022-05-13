import { Cart } from "@medusajs/medusa"
import Gift from "@modules/common/icons/gift"
import { useCart } from "medusa-react"
import React from "react"
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

  const { register, handleSubmit } = useForm()

  const onSubmit = (data: GiftCardFormValues) => {
    mutate({
      gift_cards: [{ code: data.gift_card_code }],
    })
  }

  if (cart?.gift_cards.length) {
    return (
      <div>
        <div></div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between text-gray-700 text-small-regular">
      <button className="underline">Add gift card</button>
      <Gift size={16} />
    </div>
  )
}

export default GiftCard
