import Medusa from "@medusajs/js-sdk" // Assuming the default export is the class
import { Config as MedusaConfig } from "@medusajs/js-sdk" // Import Config type if needed for finer control, though Medusa constructor types handle it
import {
  QueryClientProvider,
  QueryClientProviderProps,
  QueryClient, // Import QueryClient type for clarity
} from "@tanstack/react-query"
import React, { createContext, useContext, useMemo } from "react"

/**
 * Defines the shape of the Medusa context state.
 */
export interface MedusaContextState {
  /**
   * The Medusa JS Client instance.
   */
  client: Medusa
}

const MedusaContext = createContext<MedusaContextState | null>(null)

export const useMedusa = (): MedusaContextState => {
  const context = useContext(MedusaContext)
  if (!context) {
    throw new Error(
      "useMedusa must be used within a MedusaProvider. Make sure a MedusaProvider wraps your component tree."
    )
  }
  return context
}

export interface MedusaProviderProps {
  queryClientProviderProps: Omit<QueryClientProviderProps, "children"> & {
    client: QueryClient
  }
  baseUrl: string
  apiKey?: string
  publishableApiKey?: string // Updated name based on reference
  maxRetries?: number
  customHeaders?: Record<string, any>
  medusaClient?: Medusa
  auth?: MedusaConfig["auth"]
  debug?: boolean
  logger?: MedusaConfig["logger"]
  children: React.ReactNode
}

export const MedusaProvider = ({
  queryClientProviderProps,
  baseUrl,
  apiKey,
  publishableApiKey,
  auth,
  debug,
  logger,
  children,
  medusaClient, // Accept pre-configured client
}: MedusaProviderProps) => {
  // Memoize the client instance creation to prevent re-instantiation on every render
  // unless the dependencies change.
  const clientInstance = useMemo(() => {
    // If an external client instance is provided, use it directly.
    if (medusaClient) {
      return medusaClient
    }
    // Otherwise, create a new instance with the provided configuration.
    return new Medusa({
      baseUrl,
      apiKey,
      publishableKey: publishableApiKey, // Map prop name to SDK config name
      auth,
      debug,
      logger,
    })
  }, [medusaClient, baseUrl, apiKey, publishableApiKey, auth, debug, logger]) // Dependencies for client re-creation

  // Memoize the context value as well
  const contextValue = useMemo(
    () => ({
      client: clientInstance,
    }),
    [clientInstance]
  )

  return (
    <QueryClientProvider {...queryClientProviderProps}>
      <MedusaContext.Provider value={contextValue}>
        {children}
      </MedusaContext.Provider>
    </QueryClientProvider>
  )
}
