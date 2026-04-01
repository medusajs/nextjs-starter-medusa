import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listCategories } from "@lib/data/categories"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  const categories = await listCategories({ limit: 100 })
  const topLevelCategories = (categories ?? []).filter((c) => !c.parent_category)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group overflow-x-hidden">
      <header className="relative mx-auto bg-qw-white border-qw-pale-grey">
        {/* Top bar */}
        <div className="h-16 border-b duration-300 border-qw-pale-grey">
          <nav className="content-container text-caption uppercase tracking-[0.12em] text-qw-medium-grey flex items-center justify-between w-full h-full">
            <div className="flex-1 basis-0 h-full flex items-center">
              <div className="h-full small:hidden">
                <SideMenu
                  regions={regions}
                  locales={locales}
                  currentLocale={currentLocale}
                  topLevelCategories={topLevelCategories}
                />
              </div>
            </div>

            <div className="flex items-center h-full">
              <LocalizedClientLink
                href="/"
                className="font-serif text-card-title font-light uppercase tracking-[0.08em] text-qw-charcoal transition duration-300 hover:-translate-y-0.5 hover:opacity-85"
                data-testid="nav-store-link"
              >
                Medusa Store
              </LocalizedClientLink>
            </div>

            <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
              <div className="hidden small:flex items-center gap-x-6 h-full">
                <LocalizedClientLink
                  className="transition duration-300 hover:-translate-y-0.5 hover:text-qw-charcoal hover:opacity-85"
                  href="/account"
                  data-testid="nav-account-link"
                >
                  Account
                </LocalizedClientLink>
              </div>
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="flex gap-2 transition duration-300 hover:-translate-y-0.5 hover:text-qw-charcoal hover:opacity-85"
                    href="/cart"
                    data-testid="nav-cart-link"
                  >
                    Cart (0)
                  </LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            </div>
          </nav>
        </div>

        {/* Desktop second layer (category mega menu) */}
        <div className="hidden small:block border-b border-qw-pale-grey">
          <nav className="content-container h-14 flex items-center gap-x-10">
            {topLevelCategories.map((cat) => (
              <div
                key={cat.id}
                className="relative group h-full flex items-center"
              >
                <LocalizedClientLink
                  href={`/categories/${cat.handle}`}
                  className="uppercase tracking-[0.14em] text-qw-medium-grey transition duration-300 hover:-translate-y-0.5 hover:text-qw-charcoal hover:opacity-85"
                  data-testid="nav-mega-category-link"
                >
                  {cat.name}
                </LocalizedClientLink>

                <div
                  className="absolute left-0 top-full mt-4 w-[520px] bg-qw-white border border-qw-pale-grey p-6
                  opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
                  transition-opacity duration-300"
                >
                  <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                    {(cat.category_children ?? []).slice(0, 10).map((child) => (
                      <LocalizedClientLink
                        key={child.id}
                        href={`/categories/${child.handle}`}
                        className="text-caption uppercase tracking-[0.1em] text-qw-medium-grey transition duration-300 hover:-translate-y-0.5 hover:text-qw-charcoal hover:opacity-85"
                        data-testid="nav-mega-subcategory-link"
                      >
                        {child.name}
                      </LocalizedClientLink>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>
        </div>
      </header>
    </div>
  )
}
