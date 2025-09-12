"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

export type InternalHistoryEntry = {
  href: string
  label: string
  pageType?: "home" | "store" | "category" | "collection" | "brand" | "search" | "pdp" | "plp" | "other"
  timestamp: number
}

type InternalHistoryContextValue = {
  history: InternalHistoryEntry[]
  push: (entry: Omit<InternalHistoryEntry, "timestamp">) => void
  replaceLast: (entry: Omit<InternalHistoryEntry, "timestamp">) => void
  clear: () => void
}

const STORAGE_KEY = "__internal_history__"

const InternalHistoryContext = createContext<InternalHistoryContextValue | undefined>(undefined)

export const InternalHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<InternalHistoryEntry[]>([])

  // Load persisted history
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as InternalHistoryEntry[]
        if (Array.isArray(parsed)) {
          setHistory(parsed)
        }
      }
    } catch {}
  }, [])

  // Persist on change
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch {}
  }, [history])

  const push = useCallback((entry: Omit<InternalHistoryEntry, "timestamp">) => {
    setHistory((prev) => {
      const last = prev[prev.length - 1]
      if (last && last.href === entry.href && last.label === entry.label) {
        return prev
      }
      const next: InternalHistoryEntry = { ...entry, timestamp: Date.now() }
      const updated = [...prev, next]
      // Limit size
      return updated.slice(-20)
    })
  }, [])

  const replaceLast = useCallback((entry: Omit<InternalHistoryEntry, "timestamp">) => {
    setHistory((prev) => {
      if (prev.length === 0) return prev
      const next: InternalHistoryEntry = { ...entry, timestamp: Date.now() }
      const updated = [...prev.slice(0, -1), next]
      return updated
    })
  }, [])

  const clear = useCallback(() => setHistory([]), [])

  const value = useMemo<InternalHistoryContextValue>(() => ({ history, push, replaceLast, clear }), [history, push, replaceLast, clear])

  return <InternalHistoryContext.Provider value={value}>{children}</InternalHistoryContext.Provider>
}

export const useInternalHistory = (): InternalHistoryContextValue => {
  const ctx = useContext(InternalHistoryContext)
  if (!ctx) throw new Error("useInternalHistory must be used within InternalHistoryProvider")
  return ctx
}



