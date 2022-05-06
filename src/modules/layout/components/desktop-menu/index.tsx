import { Popover, Transition } from "@headlessui/react"
import { findCheapestPrice } from "@lib/util/prices"
import Thumbnail from "@modules/products/components/thumbnail"
import clsx from "clsx"
import { useCart } from "medusa-react"
import Link from "next/link"
import React, { useState } from "react"
import { SiteProps } from "types/global"

const DesktopMenu = ({ site }: SiteProps) => {
  const [open, setOpen] = useState(false)
  const { navData } = site
  const { cart } = useCart()
  return (
    <div
      className="mx-8 lg:flex self-stretch items-center justify-center hidden"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center gap-x-7">
        <Popover className="h-full flex">
          <>
            <Link href="/">
              <a className="relative flex">
                <Popover.Button
                  className={clsx(
                    {
                      "text-gray-900": open,
                      "text-gray-700 hover:text-gray-900": !open,
                    },
                    "relative text-base-regular flex items-center transition-all ease-out duration-200"
                  )}
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
                <div className="relative bg-white flex items-top py-8 px-9">
                  <div className="flex flex-col flex-1 max-w-[30%]">
                    <h3 className="text-base-semi text-gray-900 mb-4">
                      Collections
                    </h3>
                    <div className="grid grid-cols-2">
                      {navData.collections.map((collection) => {
                        return (
                          <Link
                            href={`/collections/${collection.id}`}
                            key={collection.id}
                          >
                            <a>{collection.title}</a>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                  <Divider />
                  <div className="flex-1">
                    <div className="grid grid-cols-3 gap-8">
                      {navData.featuredProducts.map((item) => (
                        <Link
                          href={`/products/${item.handle}`}
                          passHref
                          key={item.id}
                        >
                          <div className="group text-base sm:text-sm cursor-pointer">
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
              </Popover.Panel>
            </Transition>
          </>
        </Popover>
      </div>
    </div>
  )
}

const Divider = () => {
  return (
    <div className="h-full flex flex-col justify-center">
      <div className="border-l border-gray-200 w-px h-full flex-grow" />
      <span
        className="text-gray-200 text-xsmall-regular uppercase"
        style={{ writingMode: "vertical-rl" }}
      >
        Featured
      </span>
      <div className="border-l border-gray-200 w-px flex-grow" />
    </div>
  )
}

export default DesktopMenu
