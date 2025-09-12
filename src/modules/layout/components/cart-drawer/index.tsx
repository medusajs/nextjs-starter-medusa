"use client"

import {
    Dialog,
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
import { useCompanionPanel } from "@lib/context/companion-panel-context"

import { ShoppingBag, ArrowLeft, X } from "lucide-react"

const CartDrawerPanel = ({
    cart: cartState,
}: {
    cart?: HttpTypes.StoreCart | null
}) => {
    const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(undefined)
    const { isOpen, currentPanel, closePanel, goBack, canGoBack, isMobile, openPanel } = useCompanionPanel()

    const pathname = usePathname()

    const totalItems =
        cartState?.items?.reduce((acc, item) => {
            return acc + item.quantity
        }, 0) || 0

    const subtotal = cartState?.subtotal ?? 0
    const itemRef = useRef<number>(totalItems || 0)

    // Only render if current panel is cart
    const isCartOpen = isOpen && currentPanel?.type === 'cart'

    const timedOpen = () => {
        // Open cart panel via companion panel system
        openPanel('cart', { items: cartState?.items })
        const timer = setTimeout(closePanel, 5000)
        setActiveTimer(timer)
    }

    /**
     * Open cart drawer when modifying the cart items, but only if we're not on the cart page
     */
    useEffect(() => {
        if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
            timedOpen()
        }
        itemRef.current = totalItems
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalItems])

    // Clean up the timer when the component unmounts
    useEffect(() => {
        return () => {
            if (activeTimer) {
                clearTimeout(activeTimer)
            }
        }
    }, [activeTimer])

    // Render Cart Content (shared between mobile and desktop)
    const CartContent = () => (
        <>
            {/* Header with Back Navigation */}
            <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    {canGoBack && (
                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500 p-1"
                            onClick={goBack}
                            data-testid="back-button"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                    )}
                    <h2 className="text-lg font-medium text-gray-900">
                        Shopping Cart ({totalItems})
                    </h2>
                </div>
                <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 p-1"
                    onClick={closePanel}
                    data-testid="close-cart-button"
                >
                    <span className="sr-only">Close</span>
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto" data-testid="cart-drawer-content">
                {cartState && cartState.items?.length ? (
                    <>
                        <div className="grid grid-cols-1 gap-y-6 px-4 py-6">
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
                                            href={`/products/${item.product_handle}?from=/cart&fromLabel=Cart`}
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
                                                        <h3 className="text-base-regular overflow-hidden text-ellipsis">
                                                            <LocalizedClientLink
                                                                href={`/products/${item.product_handle}?from=/cart&fromLabel=Cart`}
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
                                                className="mt-1"
                                                data-testid="cart-item-remove-button"
                                            >
                                                Remove
                                            </DeleteButton>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full px-4 py-16">
                        <div className="bg-gray-900 text-small-regular flex items-center justify-center w-6 h-6 rounded-full text-white mb-4">
                            <span>0</span>
                        </div>
                        <span className="text-gray-500 mb-6">Your shopping bag is empty.</span>
                        <LocalizedClientLink href="/store">
                            <Button onClick={closePanel}>
                                <span className="sr-only">Go to all products page</span>
                                Explore products
                            </Button>
                        </LocalizedClientLink>
                    </div>
                )}
            </div>

            {/* Footer - Only show if cart has items */}
            {cartState && cartState.items?.length ? (
                <div className="border-t border-gray-200 px-4 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-base font-medium text-gray-900">
                            Subtotal
                        </span>
                        <span
                            className="text-base font-medium text-gray-900"
                            data-testid="cart-subtotal"
                            data-value={subtotal}
                        >
                            {convertToLocale({
                                amount: subtotal,
                                currency_code: cartState.currency_code,
                            })}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                        Shipping and taxes calculated at checkout.
                    </p>
                    <LocalizedClientLink href="/cart">
                        <Button
                            className="w-full"
                            size="large"
                            data-testid="go-to-cart-button"
                            onClick={closePanel}
                        >
                            Go to cart
                        </Button>
                    </LocalizedClientLink>
                </div>
            ) : null}
        </>
    )

    if (!isCartOpen) {
        return null
    }

    // Mobile: Render overlay modal
    if (isMobile) {
        return (
            <Transition appear show={isCartOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[75]" onClose={closePanel}>
                    {/* Backdrop with blur */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md" />
                    </Transition.Child>

                    {/* Mobile Drawer Container */}
                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-300"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-300"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                        <div className="flex h-full flex-col bg-white rounded-l-2xl ml-4 mt-4 mb-4 mr-4">
                                            <CartContent />
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        )
    }

    // Desktop: Render fixed positioned panel
    return (
        <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-96 lg:w-[400px] bg-white border-l border-gray-200 z-40 transition-transform duration-300 ease-in-out">
            <div className="flex h-full flex-col bg-white">
                <CartContent />
            </div>
        </div>
    )
}

export default CartDrawerPanel