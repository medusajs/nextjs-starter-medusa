import { retrieveCart } from "@lib/data/cart"
import CartDropdown from "../cart-dropdown"

export default async function CartButton() {
  const cart = await retrieveCart()

  if (!cart) {
    return null
  }

  return <CartDropdown cart={cart} />
}
