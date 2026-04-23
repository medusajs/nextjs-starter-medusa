import { retrieveCart } from "@lib/data/cart"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listCategories } from "@lib/data/categories"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SideMenu from "@modules/layout/components/side-menu"
import CartDropdown from "@modules/layout/components/cart-dropdown"
import NavShell from "./nav-shell"
import NavRegionSwitcher from "./nav-region-switcher"
import NavSearchInline from "./nav-search-inline"
import NavCatalogRow from "./nav-catalog-row"

export default async function Nav() {
  const [regions, locales, currentLocale, cart] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    retrieveCart().catch(() => null),
  ])

  const categories = await listCategories({ limit: 100 })
  const topLevelCategories = (categories ?? []).filter((c) => !c.parent_category)

  return (
    <NavShell>
      <header
        className="relative mx-auto transition-[background-color,border-color,background-image] duration-[800ms] ease-in-out
        group-data-[phase5=true]/nav:border-b
        group-data-[tone=solid]/nav:bg-[#f9f7f4] group-data-[phase5=true]/nav:border-qw-pale-grey
        group-data-[tone=overlay]/nav:bg-[linear-gradient(0deg,rgba(38,22,10,0)_0%,rgb(38,22,10)_100%)] group-data-[tone=overlay]/nav:border-transparent
        overflow-visible"
      >
        {/* Top bar */}
        <div
          className="h-[82px] duration-[800ms] ease-in-out
          group-data-[phase5=true]/nav:border-b group-data-[phase5=true]/nav:border-qw-pale-grey
          group-data-[tone=overlay]/nav:border-transparent"
        >
          <nav className="content-container text-caption uppercase tracking-[0.12em] flex items-center justify-between w-full h-full pt-3 pb-4">
            <div className="flex-1 basis-0 h-full flex items-center">
              {/* RH icon row alignment (hamburger + search) */}
              <div className="h-full flex items-center gap-x-8 sm:gap-x-10 lg:gap-x-12 sm:translate-y-1">
                <SideMenu
                  regions={regions}
                  locales={locales}
                  currentLocale={currentLocale}
                  topLevelCategories={topLevelCategories}
                  iconClassName="group-data-[tone=solid]/nav:bg-black group-data-[tone=overlay]/nav:bg-qw-white"
                />
                <NavSearchInline />
              </div>
            </div>

            <div className="flex items-center h-full">
              <LocalizedClientLink
                href="/"
                className="font-serif text-card-title font-light uppercase tracking-[0.08em] transition duration-300
                text-black group-data-[tone=overlay]/nav:text-qw-white"
                data-testid="nav-store-link"
              >
                Medusa Store
              </LocalizedClientLink>
            </div>

            <div className="flex items-center gap-x-8 sm:gap-x-10 lg:gap-x-12 h-full flex-1 basis-0 justify-end sm:translate-y-1">
              <div className="hidden small:flex items-center gap-x-8 sm:gap-x-10 lg:gap-x-12 h-full text-black group-data-[tone=overlay]/nav:text-qw-white">
                <NavRegionSwitcher
                  regions={regions}
                  locales={locales}
                  currentLocale={currentLocale}
                />
                <LocalizedClientLink
                  href="/account"
                  data-testid="nav-account-link"
                  aria-label="Account"
                  className="inline-flex items-center justify-center h-6 w-6"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5.37543 19.4979H19.2354V14.5083C19.2354 13.2544 18.2189 12.2379 16.965 12.2379H7.64581C6.39192 12.2379 5.37543 13.2544 5.37543 14.5083V19.4979Z" stroke="currentColor" strokeWidth="0.75" />
                    <path d="M15.5601 6.63C15.5601 8.42769 14.1028 9.885 12.3051 9.885C10.5074 9.885 9.05011 8.42769 9.05011 6.63C9.05011 4.83231 10.5074 3.375 12.3051 3.375C14.1028 3.375 15.5601 4.83231 15.5601 6.63Z" stroke="currentColor" strokeWidth="0.75" />
                  </svg>
                </LocalizedClientLink>
                <CartDropdown cart={cart} />
              </div>
            </div>
          </nav>
        </div>

        {/* Desktop second layer (RH-style static navigation row) */}
        <div className="hidden small:block group-data-[phase5=true]/nav:border-b group-data-[phase5=true]/nav:border-qw-pale-grey group-data-[tone=overlay]/nav:border-transparent">
          <nav className="content-container h-[54px] flex items-center">
            <NavCatalogRow />
          </nav>
        </div>
      </header>
    </NavShell>
  )
}
