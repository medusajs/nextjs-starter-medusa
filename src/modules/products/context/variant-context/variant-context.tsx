import { createContext } from "react"

import { HttpTypes } from "@medusajs/types"

export const VariantContext = createContext<{
  variant: HttpTypes.StoreProductVariant | null
  setVariant: (v: HttpTypes.StoreProductVariant | null) => void
}>({
  variant: null,
  setVariant: () => {},
})
