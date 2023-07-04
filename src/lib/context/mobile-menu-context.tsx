"use client"

import useCurrentWidth from "@lib/hooks/use-current-width"
import useDebounce from "@lib/hooks/use-debounce"
import useToggleState from "@lib/hooks/use-toggle-state"
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

type ScreenType = "main" | "country" | "search"

interface MobileMenuContext {
  state: boolean
  open: () => void
  close: () => void
  toggle: () => void
  screen: [ScreenType, Dispatch<SetStateAction<ScreenType>>]
}

export const MobileMenuContext = createContext<MobileMenuContext | null>(null)

export const MobileMenuProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { state, close, open, toggle } = useToggleState()
  const [screen, setScreen] = useState<ScreenType>("main")

  const windowWidth = useCurrentWidth()

  const debouncedWith = useDebounce(windowWidth, 200)

  const closeMenu = useCallback(() => {
    close()

    setTimeout(() => {
      setScreen("main")
    }, 500)
  }, [close])

  useEffect(() => {
    if (state && debouncedWith >= 1024) {
      closeMenu()
    }
  }, [debouncedWith, state, closeMenu])

  useEffect(() => {}, [debouncedWith])

  return (
    <MobileMenuContext.Provider
      value={{
        state,
        close: closeMenu,
        open,
        toggle,
        screen: [screen, setScreen],
      }}
    >
      {children}
    </MobileMenuContext.Provider>
  )
}

export const useMobileMenu = () => {
  const context = useContext(MobileMenuContext)

  if (context === null) {
    throw new Error(
      "useCartDropdown must be used within a CartDropdownProvider"
    )
  }

  return context
}
