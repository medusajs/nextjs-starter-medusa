import { Popover, Transition } from "@headlessui/react"
import { useCartDropdown } from "@lib/context/cart-dropdown-context"
import { useStore } from "@lib/context/store-context"
import useEnrichedLineItems from "@lib/hooks/use-enrich-line-items"
import { Button } from "@medusajs/ui"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import Trash from "@modules/common/icons/trash"
import Thumbnail from "@modules/products/components/thumbnail"
import { formatAmount, useCart } from "medusa-react"
import Link from "next/link"
import { Fragment } from "react"

const CartDropdown = () => {
  const { cart, totalItems } = useCart()
  const items = useEnrichedLineItems()
  const { deleteItem } = useStore()
  const { state, open, close } = useCartDropdown()

  return (
    <div className="h-full z-50" onMouseEnter={open} onMouseLeave={close}>
      <Popover className="relative h-full">
        <Popover.Button className="h-full">
          <Link
            className="hover:text-ui-fg-base"
            href="/cart"
          >{`Cart (${totalItems})`}</Link>
        </Popover.Button>
        <Transition
          show={state}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel
            static
            className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-white border-x border-b border-gray-200 w-[382px] text-gray-900"
          >
            <div className="p-4 flex items-center justify-center">
              <h3 className="text-large-semi">Cart</h3>
            </div>
            {cart && items?.length ? (
              <>
                <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-8 no-scrollbar p-px">
                  {items
                    .sort((a, b) => {
                      return a.created_at > b.created_at ? -1 : 1
                    })
                    .map((item) => (
                      <div
                        className="grid grid-cols-[122px_1fr] gap-x-4"
                        key={item.id}
                      >
                        <Link
                          href={`/products/${item.variant.product.handle}`}
                          className="w-24"
                        >
                          <Thumbnail thumbnail={item.thumbnail} size="square" />
                        </Link>
                        <div className="flex flex-col justify-between flex-1">
                          <div className="flex flex-col flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-base-regular overflow-ellipsis overflow-hidden whitespace-nowrap mr-4 w-[130px]">
                                  <Link
                                    href={`/products/${item.variant.product.handle}`}
                                  >
                                    {item.title}
                                  </Link>
                                </h3>
                                <></>
                                <LineItemOptions variant={item.variant} />
                                <span>Quantity: {item.quantity}</span>
                              </div>
                              <div className="flex justify-end">
                                <LineItemPrice
                                  region={cart.region}
                                  item={item}
                                  style="tight"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-end justify-between text-small-regular flex-1">
                            <div>
                              <button
                                className="flex items-center gap-x-1 text-gray-500"
                                onClick={() => deleteItem(item.id)}
                              >
                                <Trash size={14} />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="p-4 flex flex-col gap-y-4 text-small-regular">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">
                      Subtotal{" "}
                      <span className="font-normal">(excl. taxes)</span>
                    </span>
                    <span className="text-large-semi">
                      {formatAmount({
                        amount: cart.subtotal || 0,
                        region: cart.region,
                        includeTaxes: false,
                      })}
                    </span>
                  </div>
                  <Link href="/cart" passHref>
                    <Button className="w-full" size="large">
                      Go to cart
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div>
                <div className="flex py-16 flex-col gap-y-4 items-center justify-center">
                  <div className="bg-gray-900 text-small-regular flex items-center justify-center w-6 h-6 rounded-full text-white">
                    <span>0</span>
                  </div>
                  <span>Your shopping bag is empty.</span>
                  <div>
                    <Link href="/store">
                      <>
                        <span className="sr-only">Go to all products page</span>
                        <Button onClick={close}>Explore products</Button>
                      </>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
