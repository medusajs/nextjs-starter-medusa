import { LineItem } from "@medusajs/medusa"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import { enrichLineItems, retrieveCart } from "@modules/cart/actions"
import { BsCart } from 'react-icons/bs'
import CartDropdown from "../cart-dropdown"

const fetchCart = async () => {
  const cart = await retrieveCart()

  if (cart?.items.length) {
    const enrichedItems = await enrichLineItems(cart?.items, cart?.region_id)
    cart.items = enrichedItems as LineItem[]
    
  }

  return cart
}

export default async function CartButton() {
  const cart = await fetchCart()

  return (
    <div className="flex items-center"> 
      <CartDropdown cart={cart} />
      <LocalizedClientLink href="/cart" className="ml-2 mr-4">
        <BsCart className="h-5 w-5" /> 
      </LocalizedClientLink>
    </div>
  );
}
