"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
  topLevelCategories: HttpTypes.StoreProductCategory[] | null
}

const SideMenu = ({
  regions,
  locales,
  currentLocale,
  topLevelCategories,
}: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none"
                  aria-label="Open menu"
                >
                  <span className="sr-only">Open menu</span>
                  <span className="flex flex-col gap-y-1">
                    <span className="block w-5 h-[2px] bg-ui-fg-base" />
                    <span className="block w-5 h-[2px] bg-ui-fg-base" />
                    <span className="block w-5 h-[2px] bg-ui-fg-base" />
                  </span>
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/0 pointer-events-auto"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition-transform ease-out duration-300"
                enterFrom="-translate-x-full opacity-0"
                enterTo="translate-x-0 opacity-100"
                leave="transition-transform ease-in duration-200"
                leaveFrom="translate-x-0 opacity-100"
                leaveTo="-translate-x-full opacity-0"
              >
                <PopoverPanel className="fixed inset-y-0 left-0 z-[51] w-[320px] max-w-[85vw] bg-white border-r border-ui-border-base">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full"
                  >
                    <div
                      className="px-6 py-5 border-b border-ui-border-base flex items-center justify-between"
                      aria-hidden={true}
                    >
                      <Text className="txt-compact-xlarge-plus text-ui-fg-base uppercase">
                        Menu
                      </Text>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-6">
                      <ul className="flex flex-col gap-6 items-start justify-start">
                        <li>
                          <LocalizedClientLink
                            href="/"
                            className="text-xl leading-7 hover:text-ui-fg-base uppercase tracking-wider"
                            onClick={close}
                            data-testid="home-link"
                          >
                            Home
                          </LocalizedClientLink>
                        </li>

                        {topLevelCategories?.map((cat) => (
                          <li key={cat.id} className="flex flex-col gap-y-3 w-full">
                            <LocalizedClientLink
                              href={`/categories/${cat.handle}`}
                              className="text-xl leading-7 hover:text-ui-fg-base uppercase tracking-wider"
                              onClick={close}
                              data-testid="drawer-category-link"
                            >
                              {cat.name}
                            </LocalizedClientLink>
                            {cat.category_children?.length ? (
                              <ul className="flex flex-col gap-y-2 pl-3 border-l border-ui-border-base">
                                {cat.category_children.slice(0, 6).map((child) => (
                                  <li key={child.id}>
                                    <LocalizedClientLink
                                      href={`/categories/${child.handle}`}
                                      className="text-small-regular hover:text-ui-fg-base"
                                      onClick={close}
                                    >
                                      {child.name}
                                    </LocalizedClientLink>
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="px-6 py-6 border-t border-ui-border-base">
                      {!!locales?.length && (
                        <div
                          className="flex justify-between mb-6"
                          onMouseEnter={languageToggleState.open}
                          onMouseLeave={languageToggleState.close}
                        >
                          <LanguageSelect
                            toggleState={languageToggleState}
                            locales={locales}
                            currentLocale={currentLocale}
                          />
                          <ArrowRightMini
                            className={clx(
                              "transition-transform duration-150",
                              languageToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      )}

                      <div
                        className="flex justify-between"
                        onMouseEnter={countryToggleState.open}
                        onMouseLeave={countryToggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-150",
                            countryToggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>

                      <div className="mt-6 flex flex-col gap-y-3">
                        <LocalizedClientLink
                          href="/account"
                          className="w-full uppercase tracking-wider text-small-regular hover:text-ui-fg-base"
                          onClick={close}
                        >
                          Account
                        </LocalizedClientLink>
                        <LocalizedClientLink
                          href="/cart"
                          className="w-full uppercase tracking-wider text-small-regular hover:text-ui-fg-base"
                          onClick={close}
                        >
                          Cart
                        </LocalizedClientLink>
                      </div>

                      <button
                        type="button"
                        onClick={close}
                        className="mt-6 w-full bg-qw-black text-qw-white text-micro uppercase tracking-[0.2em] py-3 transition-opacity duration-300 hover:opacity-85"
                        data-testid="close-menu-bottom-button"
                      >
                        Close Menu
                      </button>

                      <Text className="flex justify-between txt-compact-small mt-4">
                        © {new Date().getFullYear()} Medusa Store. All rights
                        reserved.
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
