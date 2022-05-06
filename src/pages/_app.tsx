import { MEDUSA_BACKEND_URL, queryClient } from "@lib/config"
import { AccountProvider } from "@lib/context/account-context"
import { StoreProvider } from "@lib/context/store-context"
import { CartProvider, MedusaProvider } from "medusa-react"
import type { AppProps } from "next/app"
import "styles/globals.css"

function App({ Component, pageProps }: AppProps) {
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
            <Component {...pageProps} />
          </AccountProvider>
        </StoreProvider>
      </CartProvider>
    </MedusaProvider>
  )
}

export default App
