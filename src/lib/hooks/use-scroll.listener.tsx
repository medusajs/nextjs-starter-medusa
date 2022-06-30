import { useCartDropdown } from "@lib/context/cart-dropdown-context"
import { useCallback, useEffect, useState } from "react"

export const useScrollListenser = () => {
  const [show, setShow] = useState<boolean>(true)
  const [lastScrollY, setLastScrollY] = useState<number>(0)

  const { state: isCartOpen } = useCartDropdown()

  const controlNavbar = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        setShow(false)
      } else {
        setShow(true)
      }

      setLastScrollY(window.scrollY)
    }
  }, [lastScrollY, setShow])

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar)

      return () => {
        window.removeEventListener("scroll", controlNavbar)
      }
    }
  }, [lastScrollY, controlNavbar])

  // If the cart is open, then we force the navbar to show
  return isCartOpen ? isCartOpen : show
}
