import Button from "@modules/common/components/button"
import { formatAmount, useCart, useMeCustomer } from "medusa-react"
import React from "react"
import DiscountCode from "../discount-code"

const BagActions = () => {
  const { cart } = useCart()
  const { customer } = useMeCustomer()

  if (!cart) {
    return null
  }

  return (
    <div>
      <div>
        <DiscountCode cart={cart} />
        {!customer && (
          <div>
            <p>Log in for a faster checkout experience.</p>
            <Button>Log in</Button>
          </div>
        )}
        <div>
          <div>
            <span>Subtotal</span>
            <span>
              {formatAmount({
                amount: cart.subtotal || 0,
                region: cart.region,
              })}
            </span>
          </div>
          <div></div>
        </div>
        <div></div>
      </div>
    </div>
  )
}
