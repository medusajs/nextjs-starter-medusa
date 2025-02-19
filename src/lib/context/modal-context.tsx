"use client"

import React, { createContext, useContext } from "react"

//stores reeact context for managing globle states (authentication/user data /cart)

//helps share data between components without passing props mannual.

interface ModalContext {
  close: () => void
}

const ModalContext = createContext<ModalContext | null>(null)

interface ModalProviderProps {
  children?: React.ReactNode
  close: () => void
}

export const ModalProvider = ({ children, close }: ModalProviderProps) => {
  return (
    <ModalContext.Provider
      value={{
        close,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = useContext(ModalContext)
  if (context === null) {
    throw new Error("useModal must be used within a ModalProvider")
  }
  return context
}
