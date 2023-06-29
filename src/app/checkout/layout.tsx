"use client"

import { MEDUSA_BACKEND_URL, queryClient } from "@lib/config"
import { AccountProvider } from "@lib/context/account-context"
import { StoreProvider } from "@lib/context/store-context"
import { CartProvider, MedusaProvider } from "medusa-react"
import "styles/globals.css"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MedusaProvider
      baseUrl={MEDUSA_BACKEND_URL}
      queryClientProviderProps={{
        client: queryClient,
      }}
    >
      <CartProvider>
        <StoreProvider>
          <AccountProvider>
            <main className="relative">{children}</main>
          </AccountProvider>
        </StoreProvider>
      </CartProvider>
    </MedusaProvider>
  )
}
