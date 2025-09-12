"use client"

import React, { createContext, useContext, useMemo, useState, useCallback } from "react"

type FromState = {
  href?: string
  label?: string
}

type FromContextValue = {
  from: FromState
  setFrom: (next: FromState) => void
  clearFrom: () => void
}

const FromContext = createContext<FromContextValue | undefined>(undefined)

export const FromProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [from, setFromState] = useState<FromState>({})

  const setFrom = useCallback((next: FromState) => {
    setFromState((prev) => {
      const same = prev.href === next.href && prev.label === next.label
      return same ? prev : next
    })
  }, [])

  const clearFrom = useCallback(() => {
    setFromState((prev) => (prev.href || prev.label ? {} : prev))
  }, [])

  const value = useMemo<FromContextValue>(() => ({
    from,
    setFrom,
    clearFrom,
  }), [from, setFrom, clearFrom])

  return <FromContext.Provider value={value}>{children}</FromContext.Provider>
}

export const useFrom = (): FromContextValue => {
  const ctx = useContext(FromContext)
  if (!ctx) {
    throw new Error("useFrom must be used within a FromProvider")
  }
  return ctx
}


