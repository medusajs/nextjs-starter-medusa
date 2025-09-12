import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"
import { CompanionPanelProvider } from "@lib/context/companion-panel-context"
import { LeftPanelProvider } from "@lib/context/left-panel-context"
import UnifiedLayoutWrapper from "@modules/layout/components/unified-layout-wrapper"
import ResizableCompanionPanel from "@modules/layout/components/resizable-companion-panel"
import { FromProvider } from "@lib/context/from-context"
import { InternalHistoryProvider } from "@lib/context/internal-history-context"
import RouteAwareHistory from "@modules/common/components/route-aware-history"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()

    shippingOptions = shipping_options
  }

  return (
    <LeftPanelProvider>
      <CompanionPanelProvider>
        <Nav />
        {customer && cart && (
          <CartMismatchBanner customer={customer} cart={cart} />
        )}

        {cart && (
          <FreeShippingPriceNudge
            variant="popup"
            cart={cart}
            shippingOptions={shippingOptions}
          />
        )}
        
        <InternalHistoryProvider>
          <FromProvider>
            <RouteAwareHistory />
            <UnifiedLayoutWrapper 
              footer={<Footer />}
              className="debug-content-size"
            >
              {props.children}
            </UnifiedLayoutWrapper>
          </FromProvider>
        </InternalHistoryProvider>
        
        <ResizableCompanionPanel cart={cart} />
      </CompanionPanelProvider>
    </LeftPanelProvider>
  )
}