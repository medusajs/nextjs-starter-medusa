"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment, useEffect, useState } from "react"
import { createPortal } from "react-dom"

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
  iconClassName?: string
}

const SideMenu = ({
  regions,
  locales,
  currentLocale,
  topLevelCategories,
  iconClassName = "bg-ui-fg-base",
}: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()
  const [mounted, setMounted] = useState(false)
  const desktopMenuColumns = [
    {
      titleTop: "WQ",
      titleBottom: "PRODUCTS",
      imageUrl:
        "https://media.restorationhardware.com/is/image/rhis/nav-products?wid=500",
      items: [
        "WQ",
        "WQ INTERIORS",
        "WQ MODERN",
        "WQ OUTDOOR",
        "WQ BABY & CHILD",
        "WQ TEEN",
        "VIEW SOURCEBOOKS",
        "WQ MEMBERS PROGRAM",
      ],
    },
    {
      titleTop: "WQ",
      titleBottom: "PLACES",
      imageUrl:
        "https://media.restorationhardware.com/is/image/rhis/nav-places?wid=500",
      items: [
        "GALLERIES",
        "Explore Our Galleries",
        "Find a Gallery",
        "GUESTHOUSE",
        "RESTAURANTS",
        "Restaurants & Wine Bars",
      ],
    },
    {
      titleTop: "WQ",
      titleBottom: "SERVICES",
      imageUrl:
        "https://media.restorationhardware.com/is/image/rhis/nav-services?wid=500",
      items: [
        "INTERIOR DESIGN",
        "Explore WQ Interior Design",
        "Request a Design Consultation",
        "WQ Interior Design Palm Desert",
        "TRADE",
        "Explore WQ Trade",
        "WQ Trade Program Sign-In",
      ],
    },
    {
      titleTop: "WQ",
      titleBottom: "SPACES",
      imageUrl:
        "https://media.restorationhardware.com/is/image/rhis/nav-spaces?wid=500",
      items: [
        "WQ One Gulfstream 650ER",
        "WQ Two Gulfstream 550",
        "WQ Three Expedition Yacht",
      ],
    },
  ]

  const desktopFooterLinks = [
    "Customer Experience",
    "Sign up for Emails",
    "Request a Sourcebook",
    "Investor Relations",
    "Press",
    "Privacy Notice",
    "Careers",
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

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
                  <span className="relative block h-6 w-6">
                    <span
                      className={clx(
                        "absolute left-[1px] top-[4px] block h-[1px] w-[22px] transition-transform duration-300",
                        iconClassName,
                        open ? "translate-y-[7px] rotate-45" : ""
                      )}
                    />
                    <span
                      className={clx(
                        "absolute left-[1px] top-[11px] block h-[1px] w-[22px] transition-opacity duration-300",
                        iconClassName,
                        open ? "opacity-0" : "opacity-100"
                      )}
                    />
                    <span
                      className={clx(
                        "absolute left-[1px] top-[18px] block h-[1px] w-[22px] transition-transform duration-300",
                        iconClassName,
                        open ? "-translate-y-[7px] -rotate-45" : ""
                      )}
                    />
                  </span>
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/0 pointer-events-auto small:hidden"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}
              {mounted && open
                ? createPortal(
                    <div
                      className="hidden small:block fixed inset-0 z-[1098] min-w-0 bg-black/0 pointer-events-auto"
                      onClick={close}
                      data-testid="desktop-hamburger-backdrop"
                    />,
                    document.body
                  )
                : null}

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
                <PopoverPanel className="fixed inset-y-0 left-0 z-[51] w-[320px] max-w-[85vw] bg-white border-r border-ui-border-base small:hidden">
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

              {mounted && open
                ? createPortal(
                    <div className="hidden small:block fixed inset-x-0 top-[136px] z-[1099] min-w-0 h-[calc(100vh-136px)] overflow-hidden bg-[#f9f7f4]">
                      <div className="h-[calc(100%-64px)] overflow-y-auto px-[40px] pt-[16px] pb-[8px] xl:px-[80px]">
                        <div className="grid w-full grid-cols-4 gap-8">
                          {desktopMenuColumns.map((column) => (
                            <div key={column.titleBottom}>
                              <button
                                type="button"
                                className="block h-auto w-full cursor-pointer p-0"
                              >
                                <div className="relative block h-[180px] w-full overflow-hidden xl:h-[190px]">
                                  <img
                                    src={column.imageUrl}
                                    alt={`${column.titleTop} ${column.titleBottom}`}
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              </button>
                              <button
                                type="button"
                                className="mt-[20px] block no-underline text-left"
                              >
                                <span>
                                  <p className="mb-[-6px] font-serif text-[17px] uppercase leading-none tracking-[0.01em] text-qw-charcoal">
                                    {column.titleTop}
                                  </p>
                                  <h3 className="font-serif text-[36px] uppercase leading-[0.96] tracking-[0.01em] text-qw-charcoal">
                                    {column.titleBottom}
                                  </h3>
                                </span>
                              </button>
                              <ul className="pt-[20px]">
                                {column.items.map((item) => (
                                  <li key={item} role="none" className="pb-[6px]">
                                    <button
                                      type="button"
                                      className="decoration-transparent underline-offset-[5px] transition-all duration-700 hover:cursor-pointer hover:underline hover:decoration-black"
                                    >
                                      <p className="text-[12px] leading-[1.5] tracking-[0.01em] text-qw-charcoal text-left">
                                        {item}
                                      </p>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex h-16 shrink-0 items-center overflow-x-auto whitespace-nowrap bg-[#f1f0ed] px-[40px] xl:px-[80px]">
                        {desktopFooterLinks.map((label) => (
                          <button
                            key={label}
                            type="button"
                            className="mr-[36px] decoration-transparent underline-offset-[5px] transition-all duration-700 hover:cursor-pointer hover:underline hover:decoration-black"
                          >
                            <p className="text-[13px] leading-5 text-qw-charcoal">
                              {label}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>,
                    document.body
                  )
                : null}
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
