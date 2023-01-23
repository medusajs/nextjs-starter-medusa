import { medusaClient } from "@lib/config"
import { Customer } from "@medusajs/medusa"
import { useMutation } from "@tanstack/react-query"
import { useMeCustomer } from "medusa-react"
import { useRouter } from "next/router"
import React, { createContext, useCallback, useContext, useState } from "react"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

interface AccountContext {
  customer?: Omit<Customer, "password_hash">
  retrievingCustomer: boolean
  loginView: [LOGIN_VIEW, React.Dispatch<React.SetStateAction<LOGIN_VIEW>>]
  checkSession: () => void
  refetchCustomer: () => void
  handleLogout: () => void
}

const AccountContext = createContext<AccountContext | null>(null)

interface AccountProviderProps {
  children?: React.ReactNode
}

const handleDeleteSession = () => {
  return medusaClient.auth.deleteSession()
}

export const AccountProvider = ({ children }: AccountProviderProps) => {
  const {
    customer,
    isLoading: retrievingCustomer,
    refetch,
    remove,
  } = useMeCustomer({ onError: () => {} })
  const loginView = useState<LOGIN_VIEW>(LOGIN_VIEW.SIGN_IN)

  const router = useRouter()

  const checkSession = useCallback(() => {
    if (!customer && !retrievingCustomer) {
      router.push("/account/login")
    }
  }, [customer, retrievingCustomer, router])

  const useDeleteSession = useMutation({
    mutationFn: handleDeleteSession,
    mutationKey: ["delete-session"],
  })

  const handleLogout = () => {
    useDeleteSession.mutate(undefined, {
      onSuccess: () => {
        remove()
        loginView[1](LOGIN_VIEW.SIGN_IN)
        router.push("/")
      },
    })
  }

  return (
    <AccountContext.Provider
      value={{
        customer,
        retrievingCustomer,
        loginView,
        checkSession,
        refetchCustomer: refetch,
        handleLogout,
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}

export const useAccount = () => {
  const context = useContext(AccountContext)

  if (context === null) {
    throw new Error("useAccount must be used within a AccountProvider")
  }
  return context
}
