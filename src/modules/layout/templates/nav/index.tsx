import { Suspense } from "react"
import { User } from "lucide-react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import ConfigurableCompanionTriggers from "@modules/layout/components/configurable-companion-triggers"
import LeftCompanionPanel from "@modules/layout/components/left-companion-panel"
import { LeftPanelSectionMenu } from "@modules/layout/components/left-companion-panel/sections"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-[50] group" style={{ height: 'var(--header-height, 4rem)' }}>
      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} />
              <LeftCompanionPanel>
                <LeftPanelSectionMenu regions={regions} />
              </LeftCompanionPanel>
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
              data-testid="nav-store-link"
            >
              Medusa Store
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-3 h-full flex-1 basis-0 justify-end">
            
            {/* Configurable Companion Panel Triggers */}
            <ConfigurableCompanionTriggers />
            
            {/* Cart Button - Core feature, always enabled */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex items-center justify-center w-6 h-6"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <span className="relative w-6 h-6 flex items-center justify-center">
                    <span className="w-5 h-5 inline-block border border-gray-300 rounded"></span>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold">0</span>
                  </span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
