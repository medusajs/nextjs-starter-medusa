import { Popover, Transition } from "@headlessui/react"
import { findCheapestPrice } from "@lib/util/prices"
import Thumbnail from "@modules/products/components/thumbnail"
import clsx from "clsx"
import { useCart } from "medusa-react"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useMemo, useState } from "react"
import { SiteProps } from "types/global"

const DropdownMenu = ({ site }: SiteProps) => {
  const [open, setOpen] = useState(false)
  const { navData } = site
  const { cart } = useCart()

  const { asPath, push } = useRouter()

  const active = useMemo(() => {
    return asPath === "/shop"
  }, [asPath])

  return (
    <div
      className="mx-3 lg:flex self-stretch items-center justify-center hidden"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          <>
            <Link href="/shop" passHref>
              <a className="relative flex h-full">
                <Popover.Button
                  className={clsx(
                    "relative h-full flex items-center transition-all ease-out duration-200 px-5"
                  )}
                  onClick={() => push("/shop")}
                >
                  Shop
                </Popover.Button>
              </a>
            </Link>

            <Transition
              show={open}
              as={React.Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Popover.Panel
                static
                className="absolute top-full inset-x-0 text-sm text-gray-700 z-30 border-b border-b-gray-200"
              >
                <div className="relative bg-white py-8 px-9">
                  <div className="flex items-start max-w-7xl mx-auto">
                    <div className="flex flex-col flex-1 max-w-[30%]">
                      <h3 className="text-base-semi text-gray-900 mb-4">
                        Collections
                      </h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {navData.collections.map((collection) => {
                          return (
                            <Link
                              href={`/collections/${collection.id}`}
                              key={collection.id}
                            >
                              <a onClick={() => setOpen(false)}>
                                {collection.title}
                              </a>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="grid grid-cols-3 gap-4">
                        {navData.featuredProducts.map((item) => (
                          <Link
                            href={`/products/${item.handle}`}
                            passHref
                            key={item.id}
                          >
                            <div
                              className="group text-base sm:text-sm cursor-pointer"
                              onClick={() => setOpen(false)}
                            >
                              <Thumbnail {...item} size="full" />
                              <div className="mt-3 block text-base-regular text-gray-900">
                                {item.title}
                              </div>
                              <div className="text-small-regular text-gray-700">
                                {cart?.region &&
                                  findCheapestPrice(item.variants, cart.region)}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        </Popover>
      </div>
    </div>
  )
}

export default DropdownMenu
