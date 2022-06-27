import { MEDUSA_BACKEND_URL, queryClient } from "@lib/config"
import { AccountProvider } from "@lib/context/account-context"
import { CartDropdownProvider } from "@lib/context/cart-dropdown-context"
import { StoreProvider } from "@lib/context/store-context"
import { CartProvider, MedusaProvider } from "medusa-react"
import "styles/globals.css"
import "styles/slick-theme.css"
import { AppPropsWithLayout } from "types/global"

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <MedusaProvider
      baseUrl={MEDUSA_BACKEND_URL}
      queryClientProviderProps={{
        client: queryClient,
      }}
    >
      <CartDropdownProvider>
        <CartProvider>
          <StoreProvider>
            <AccountProvider>
              {getLayout(<Component {...pageProps} />)}
            </AccountProvider>
          </StoreProvider>
        </CartProvider>
      </CartDropdownProvider>
    </MedusaProvider>
  )
}

export default App
