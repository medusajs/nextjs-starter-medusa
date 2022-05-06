import { Dialog, Transition } from "@headlessui/react"
import Thumbnail from "@modules/products/components/thumbnail"
import clsx from "clsx"
import Link from "next/link"
import React, { Fragment } from "react"
import { SiteProps } from "types/global"
import { Product } from "types/medusa"

type MobileMenuProps = {
  open: boolean
  onClose: () => void
} & SiteProps

const MobileMenu: React.FC<MobileMenuProps> = ({ open, onClose, site }) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 flex z-30 lg:hidden"
        onClose={() => {}}
      >
        <Transition.Child
          as={React.Fragment}
          enter="transition ease-in-out duration-500 transform"
          enterFrom="-translate-y-full"
          enterTo="translate-y-0"
          leave="transition ease-in-out duration-500 transform"
          leaveFrom="translate-y-0"
          leaveTo="-translate-y-full"
        >
          <div className="relative w-full bg-white pt-16 pb-12 flex flex-col overflow-y-auto">
            <div className="border-t border-gray-200 py-6 px-4 space-y-6">
              <FeaturedProducts products={site.navData.featuredProducts} />

              <div className="flex flex-col">
                <span className="text-base-semi text-gray-900 mb-2">
                  Collections
                </span>
                <div className="flex flex-col gap-y-1 text-small-regular text-gray-700">
                  {site.navData.collections.map((collection) => {
                    return (
                      <Link
                        href={`/collections/${collection.id}`}
                        passHref
                        key={collection.id}
                      >
                        <a>{collection.title}</a>
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-base-semi text-gray-900 mb-2">
                  Account
                </span>
                <div className="flex flex-col gap-y-1 text-small-regular text-gray-700">
                  <Link href={`/customer/login`} passHref>
                    <a>Login</a>
                  </Link>
                  <Link href={`/customer/create`} passHref>
                    <a>Create account</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  )
}

const FeaturedProducts = ({ products }: { products: Product[] }) => {
  return (
    <div className="flex items-start gap-x-4">
      {products.slice(0, 2).map((product, i) => {
        return (
          <div
            key={i}
            className={clsx({
              "w-1/2": products.length > 1,
            })}
          >
            <Thumbnail {...product} size="full" />
          </div>
        )
      })}
    </div>
  )
}

export default MobileMenu
