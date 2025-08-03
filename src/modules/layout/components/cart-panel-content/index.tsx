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

interface CartPanelContentProps {
  cart?: HttpTypes.StoreCart | null
}

const CartPanelContent: React.FC<CartPanelContentProps> = ({ cart: cartState }) => {
  const { closePanel } = useCompanionPanel()

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Shopping Cart ({totalItems})
        </h2>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-500"
          onClick={closePanel}
          data-testid="close-cart-button"
        >
          <span className="sr-only">Close</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
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
                            <h3 className="text-base-regular overflow-hidden text-ellipsis">
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