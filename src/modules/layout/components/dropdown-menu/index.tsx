import { Popover, Transition } from "@headlessui/react"
import ProductPreview from "@modules/products/components/product-preview"
import clsx from "clsx"
import { useCart, useCollections, useProducts } from "medusa-react"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useMemo, useState } from "react"

const DropdownMenu = () => {
  const [open, setOpen] = useState(false)
  const { cart } = useCart()

  const { asPath, push } = useRouter()

  const active = useMemo(() => {
    return asPath === "/shop"
  }, [asPath])

  const { collections } = useCollections()
  const { products: featuredProducts } = useProducts({
    limit: 3,
    is_giftcard: false,
  })

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="h-full"
    >
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          <>
            <Link href="/shop" passHref>
              <a className="relative flex h-full">
                <Popover.Button
                  className={clsx(
                    "relative h-full flex items-center transition-all ease-out duration-200"
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
                className="absolute top-full inset-x-0 text-sm text-gray-700 z-30 border-y border-gray-200"
              >
                <div className="relative bg-white py-8">
                  <div className="flex items-start content-container">
                    <div className="flex flex-col flex-1 max-w-[30%]">
                      <h3 className="text-base-semi text-gray-900 mb-4">
                        Collections
                      </h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {collections?.map((collection) => {
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
                        {featuredProducts?.map((item) => (
                          <ProductPreview product={item} key={item.id} />
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
