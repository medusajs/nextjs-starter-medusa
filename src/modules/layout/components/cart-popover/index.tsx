import { Dialog, Transition } from "@headlessui/react"
import LineItem from "@modules/common/components/line-item"
import Cart from "@modules/common/icons/cart"
import X from "@modules/common/icons/x"
import { formatAmount, useCart } from "medusa-react"
import Link from "next/link"
import React, { Fragment } from "react"

const CartPopover: React.FC = () => {
  const { totalItems, cart } = useCart()
  const [open, setOpen] = React.useState(false)

  // function to reduce the unit_price of each item in the cart
  const getSubTotal = () => {
    if (!cart?.items?.length) {
      return undefined
    }

    const total = cart?.items?.reduce((acc, item) => {
      return acc + item.unit_price * item.quantity
    }, 0)

    return formatAmount({ amount: total, region: cart?.region })
  }

  return (
    <>
      <button className="relative text-gray-700" onClick={() => setOpen(!open)}>
        <span
          className="absolute top-0 right-0 rounded-full bg-violet-600 text-white w-3 h-3 flex items-center justify-center text-[8px]"
          data-cy="cart_quantity"
        >
          {totalItems}
        </span>
        <Cart size={24} className="pr-1" />
      </button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-hidden z-[100]"
          onClose={setOpen}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="absolute inset-0 bg-gray-700 bg-opacity-75 transition-opacity backdrop-blur-sm" />
            </Transition.Child>

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="pointer-events-auto w-screen max-w-xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div>
                      <CartHeader onClose={() => setOpen(false)} />

                      {cart?.items?.length ? (
                        <div className="my-7">
                          <div className="px-9">
                            <ul role="list" className="flex flex-col gap-y-4">
                              {cart?.items
                                ?.sort((a, b) => {
                                  return a.created_at > b.created_at ? -1 : 1
                                })
                                .map((item, index) => (
                                  <li key={index}>
                                    <LineItem
                                      item={item}
                                      region={cart.region}
                                    />
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="px-9 py-7">
                          <span className="text-base-regular text-gray-700">
                            Your shopping cart is empty
                          </span>
                        </div>
                      )}
                    </div>

                    <CartFooter
                      itemCount={cart?.items?.length}
                      subtotal={getSubTotal()}
                      onClose={() => setOpen(false)}
                    />
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

const CartHeader = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="flex items-start justify-between px-9 py-7 border-b border-b-gray-200">
      <Dialog.Title className="text-xl-semi">Cart</Dialog.Title>
      <div className="ml-3 flex h-7 items-center">
        <button type="button" className="-m-2 p-2" onClick={onClose}>
          <span className="sr-only">Close panel</span>
          <X size={20} />
        </button>
      </div>
    </div>
  )
}

const CartFooter = ({
  itemCount,
  subtotal,
  onClose,
}: {
  itemCount?: number
  subtotal?: string
  onClose: () => void
}) => {
  return (
    <div className="flex flex-col text-base-semi">
      {itemCount ? (
        <Link href="/checkout" passHref>
          <button
            disabled={!itemCount}
            className="bg-gray-900 py-5 text-white text-base-semi uppercase"
          >
            {itemCount ? "Continue to checkout" : "Continue shopping"}
          </button>
        </Link>
      ) : (
        <button
          className="bg-gray-900 py-5 text-white text-base-semi uppercase"
          onClick={onClose}
        >
          {itemCount ? "Continue to checkout" : "Continue shopping"}
        </button>
      )}
      {subtotal && (
        <div className="flex items-center justify-between px-9 py-6 text-large-semi">
          <span>Subtotal</span>
          <span>{subtotal}</span>
        </div>
      )}
    </div>
  )
}

export default CartPopover
