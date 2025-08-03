import { retrieveCart } from "@lib/data/cart"
import CartTriggerButton from "../cart-trigger-button"
import CartAutoOpen from "../cart-auto-open"

export default async function CartButton() {
  const cart = await retrieveCart().catch(() => null)

  const totalItems = cart?.items?.reduce((acc, item) => {
    return acc + item.quantity
  }, 0) || 0

  return (
    <>
      <CartTriggerButton totalItems={totalItems} />
      <CartAutoOpen 
        cart={cart}
        autoOpenOnMobile={false}    // Disable on mobile for better UX
        autoOpenDuration={4000}     // 4 seconds - quick preview
        disabled={false}            // Enable auto-open
      />
    </>
  )
}