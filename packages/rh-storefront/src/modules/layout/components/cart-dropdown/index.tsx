"use client"

import {
  Popover,
  PopoverButton,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)
  const triggerRef = useRef<HTMLDivElement>(null)
  const hoverCloseTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [mounted, setMounted] = useState(false)
  const [panelTop, setPanelTop] = useState(0)

  const cancelScheduledClose = () => {
    if (hoverCloseTimerRef.current) {
      clearTimeout(hoverCloseTimerRef.current)
      hoverCloseTimerRef.current = null
    }
  }

  const scheduleClose = () => {
    cancelScheduledClose()
    hoverCloseTimerRef.current = setTimeout(() => close(), 120)
  }

  const updatePanelPosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    setPanelTop(rect.bottom + 5)
  }

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    cancelScheduledClose()

    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    updatePanelPosition()

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    setMounted(true)
    return () => cancelScheduledClose()
  }, [])

  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  useEffect(() => {
    if (!cartDropdownOpen) return

    updatePanelPosition()
    window.addEventListener("resize", updatePanelPosition)
    window.addEventListener("scroll", updatePanelPosition, { passive: true })

    return () => {
      window.removeEventListener("resize", updatePanelPosition)
      window.removeEventListener("scroll", updatePanelPosition)
    }
  }, [cartDropdownOpen])

  return (
    <div
      ref={triggerRef}
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={scheduleClose}
    >
      <Popover className="relative h-full">
        <PopoverButton className="h-full">
          <LocalizedClientLink
            className="inline-flex h-full items-center justify-center gap-1 text-black group-data-[tone=overlay]/nav:text-qw-white"
            href="/cart"
            data-testid="nav-cart-link"
            aria-label={`Cart (${totalItems})`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M4.51758 7.75806H18.7976V17.342C18.7976 18.8089 17.6084 19.9981 16.1415 19.9981H7.17363C5.70673 19.9981 4.51758 18.8089 4.51758 17.342V7.75806Z"
                stroke="currentColor"
                strokeWidth="0.75"
              />
              <path
                d="M15.0225 6.73622C15.0225 8.59465 13.516 10.1012 11.6575 10.1012C9.7991 10.1012 8.29254 8.59465 8.29254 6.73622C8.29254 4.87778 9.7991 3.37122 11.6575 3.37122C13.516 3.37122 15.0225 4.87778 15.0225 6.73622Z"
                stroke="currentColor"
                strokeWidth="0.75"
              />
            </svg>
            {totalItems > 0 ? (
              <span className="text-caption text-current">({totalItems})</span>
            ) : null}
          </LocalizedClientLink>
        </PopoverButton>
        {mounted
          ? createPortal(
              <Transition
                show={cartDropdownOpen}
                as={Fragment}
                enter="transition ease-out duration-300"
                enterFrom="opacity-0 translate-x-full"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 translate-x-full"
              >
                <div
                  className="hidden small:flex fixed z-[9999] right-0 top-0 h-full w-full max-w-[420px] bg-[#f9f7f4] border-l border-qw-pale-grey text-qw-charcoal font-sans flex-col overflow-hidden"
                  style={{
                    top: panelTop,
                    maxHeight: `calc(100dvh - ${panelTop}px)`,
                  }}
                  onMouseEnter={cancelScheduledClose}
                  onMouseLeave={scheduleClose}
                  data-testid="nav-cart-dropdown"
                >
            <div className="p-4 flex items-center justify-center border-b border-qw-pale-grey">
              <h3 className="text-[13px] tracking-[0.06em] text-qw-charcoal">Cart</h3>
            </div>
            {cartState && cartState.items?.length ? (
              <>
                <div className="max-h-[56vh] overflow-y-auto px-4 grid grid-cols-1 gap-y-8 no-scrollbar p-px">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="grid grid-cols-[122px_1fr] gap-x-4"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-24"
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                          />
                        </LocalizedClientLink>
                        <div className="flex flex-col justify-between flex-1">
                          <div className="flex flex-col flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[180px]">
                                <h3 className="text-[13px] tracking-[0.06em] overflow-hidden text-ellipsis text-qw-charcoal">
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
                                    data-testid="product-link"
                                  >
                                    {item.title}
                                  </LocalizedClientLink>
                                </h3>
                                <LineItemOptions
                                  variant={item.variant}
                                  data-testid="cart-item-variant"
                                  data-value={item.variant}
                                />
                                <span
                                  className="text-[13px] leading-5 tracking-[0.06em] text-qw-medium-grey"
                                  data-testid="cart-item-quantity"
                                  data-value={item.quantity}
                                >
                                  Quantity: {item.quantity}
                                </span>
                              </div>
                              <div className="flex justify-end">
                                <LineItemPrice
                                  item={item}
                                  style="tight"
                                  currencyCode={cartState.currency_code}
                                />
                              </div>
                            </div>
                          </div>
                          <DeleteButton
                            id={item.id}
                            className="mt-1 text-[12px] tracking-[0.04em] text-qw-medium-grey hover:text-qw-charcoal"
                            data-testid="cart-item-remove-button"
                          >
                            Remove
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="p-4 flex flex-col gap-y-4 text-[13px] tracking-[0.06em] text-qw-charcoal">
                  <div className="flex items-center justify-between">
                    <span className="text-qw-charcoal font-semibold">
                      Subtotal{" "}
                      <span className="font-normal">(excl. taxes)</span>
                    </span>
                    <span
                      className="text-[20px] leading-7 font-semibold text-qw-charcoal"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <LocalizedClientLink href="/cart" passHref>
                    <Button
                      className="w-full bg-qw-charcoal text-qw-white border-0 h-10 text-[12px] uppercase tracking-[0.08em] hover:opacity-90"
                      size="large"
                      data-testid="go-to-cart-button"
                    >
                      Go to cart
                    </Button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div>
                <div className="flex-1 flex py-16 flex-col gap-y-4 items-center justify-center">
                  <div className="bg-gray-900 text-small-regular flex items-center justify-center w-6 h-6 rounded-full text-white">
                    <span>0</span>
                  </div>
                  <span>Your shopping bag is empty.</span>
                  <div>
                    <LocalizedClientLink href="/store">
                      <>
                        <span className="sr-only">Go to all products page</span>
                        <Button onClick={close}>Explore products</Button>
                      </>
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>
            )}
                </div>
              </Transition>,
              document.body
            )
          : null}
      </Popover>
    </div>
  )
}

export default CartDropdown
