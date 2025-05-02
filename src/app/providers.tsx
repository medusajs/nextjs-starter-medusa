"use client"

import { ReactNode } from "react"
import { Inspector } from "react-dev-inspector"

// Only initialize the inspector in development mode
const InspectorWrapper =
  process.env.NODE_ENV === "development"
    ? Inspector
    : ({ children }: { children: ReactNode }) => <>{children}</>

export function InspectorProvider({ children }: { children: ReactNode }) {
  return <InspectorWrapper keys={["Option", "C"]}>{children}</InspectorWrapper>
}
