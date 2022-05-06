import { medusaClient } from "@lib/config"
import { handleError } from "@lib/util/handle-error"
import {
  useCart,
  useCreateLineItem,
  useDeleteLineItem, useUpdateLineItem
} from "medusa-react"
import React, { useEffect } from "react"

interface VariantInfoProps {
  variantId: string
  quantity: number
}

interface LineInfoProps {
  lineId: string
  quantity: number
}

interface StoreContext {
  setRegion: (regionId: string) => void
  addItem: (item: VariantInfoProps) => void
  updateItem: (item: LineInfoProps) => void
  deleteItem: (lineId: string) => void
}

const StoreContext = React.createContext<StoreContext | null>(null)

export const useStore = () => {
  const context = React.useContext(StoreContext)
  if (context === null) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}

interface StoreProps {
  children: React.ReactNode
}

const IS_SERVER = typeof window === "undefined"
const CART_KEY = "medusa_cart_id"

export const StoreProvider = ({ children }: StoreProps) => {
  const { cart, setCart, createCart, updateCart } = useCart()
  const addLineItem = useCreateLineItem(cart?.id!)
  const removeLineItem = useDeleteLineItem(cart?.id!)
  const adjustLineItem = useUpdateLineItem(cart?.id!)

  const storeInLocalStorage = (id: string) => {
    if (!IS_SERVER) {
      localStorage.setItem(CART_KEY, id)
    }
  }

  const getFromLocalStorage = () => {
    if (!IS_SERVER) {
      return localStorage.getItem(CART_KEY)
    }
    return null
  }

  const createNewCart = async () => {
    await createCart.mutateAsync(
      {},
      {
        onSuccess: ({ cart }) => {
          setCart(cart)
          storeInLocalStorage(cart.id)
        },
        onError: (error) => {
          if (process.env.NODE_ENV === "development") {
            console.error(error)
          }
        },
      }
    )
  }

  useEffect(() => {
    const ensureCart = async () => {
      const cartId = getFromLocalStorage()

      if (cartId) {
        medusaClient.carts
          .retrieve(cartId)
          .then(({ cart }) => {
            setCart(cart)
          })
          .catch(async (_) => {
            await createNewCart()
          })
      } else {
        await createNewCart()
      }
    }

    if (!IS_SERVER && !cart?.id) {
      ensureCart()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setRegion = async (regionId: string) => {
    await updateCart.mutateAsync(
      {
        region_id: regionId,
      },
      {
        onSuccess: (data) => {
          const { cart } = data
          setCart(cart)
          storeInLocalStorage(cart.id)
        },
        onError: (error) => {
          if (process.env.NODE_ENV === "development") {
            console.error(error)
          }
        },
      }
    )
  }

  const addItem = ({
    variantId,
    quantity,
  }: {
    variantId: string
    quantity: number
  }) => {
    addLineItem.mutate(
      {
        variant_id: variantId,
        quantity: quantity,
      },
      {
        onSuccess: ({ cart }) => {
          setCart(cart)
          storeInLocalStorage(cart.id)
        },
        onError: (error) => {
          handleError(error)
        },
      }
    )
  }

  const deleteItem = (lineId: string) => {
    removeLineItem.mutate(
      {
        lineId,
      },
      {
        onSuccess: ({ cart }) => {
          setCart(cart)
          storeInLocalStorage(cart.id)
        },
        onError: (error) => {
          handleError(error)
        },
      }
    )
  }

  const updateItem = ({
    lineId,
    quantity,
  }: {
    lineId: string
    quantity: number
  }) => {
    adjustLineItem.mutate(
      {
        lineId,
        quantity,
      },
      {
        onSuccess: ({ cart }) => {
          setCart(cart)
          storeInLocalStorage(cart.id)
        },
        onError: (error) => {
          handleError(error)
        },
      }
    )
  }

  return (
    <StoreContext.Provider
      value={{
        setRegion,
        addItem,
        deleteItem,
        updateItem,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}
