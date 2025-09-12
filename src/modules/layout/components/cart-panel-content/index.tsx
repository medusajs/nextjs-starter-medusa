"use client"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { useCompanionPanel } from "@lib/context/companion-panel-context"
import { ArrowLeft, X } from "lucide-react"

interface CartPanelContentProps {
  cart?: HttpTypes.StoreCart | null
}

const CartPanelContent: React.FC<CartPanelContentProps> = ({ cart: cartState }) => {
  const { closePanel, goBack, panelHistory } = useCompanionPanel()

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0

  // Handle back button click
  const handleBackClick = () => {
    if (panelHistory.length > 0) {
      goBack()
    } else {
      closePanel()
    }
  }

  return (
    <>
      {/* Header (compact, no decorative icons) */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
        {/* Left side - Back button (only show if there's history) */}
        {panelHistory.length > 0 && (
          <button
            onClick={handleBackClick}
            className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors mr-2"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        {/* Center/Left - Title */}
        <h2 className="ty-title text-gray-900 flex-1">
          Shopping Cart ({totalItems})
        </h2>
        
        {/* Right side - Close button */}
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
          onClick={closePanel}
          data-testid="close-cart-button"
          title="Close cart"
        >
          <X className="w-5 h-5" />
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
}

export default CartPanelContent