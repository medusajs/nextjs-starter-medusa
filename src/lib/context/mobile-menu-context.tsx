import useToggleState, { StateType } from "@lib/hooks/use-toggle-state"
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react"

type ScreenType = "main" | "country" | "search"

interface MobileMenuContext {
  control: StateType
  screen: [ScreenType, Dispatch<SetStateAction<ScreenType>>]
}

export const MobileMenuContext = createContext<MobileMenuContext | null>(null)

export const MobileMenuProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const control = useToggleState()
  const screen = useState<ScreenType>("main")

  return (
    <MobileMenuContext.Provider value={{ control, screen }}>
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
