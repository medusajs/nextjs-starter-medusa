import { Dialog, Disclosure, Transition } from "@headlessui/react"
import { useAccount } from "@lib/context/account-context"
import ChevronDown from "@modules/common/icons/chevron-down"
import X from "@modules/common/icons/x"
import { useCollections } from "medusa-react"
import Link from "next/link"
import React, { Fragment } from "react"
import ReactCountryFlag from "react-country-flag"

type MobileMenuProps = {
  open: boolean
  onClose: () => void
}

const MobileMenu: React.FC<MobileMenuProps> = ({ open, onClose }) => {
  const { customer, retrievingCustomer } = useAccount()
  const { collections } = useCollections()
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 flex z-50" onClose={onClose}>
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
            <Dialog.Overlay className="absolute inset-0 bg-gray-700 bg-opacity-75 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="pointer-events-none fixed inset-y-0 right-left flex max-w-full">
            <Transition.Child
              as={Fragment}
              enter="transition-all ease-in-out duration-500"
              enterFrom="-translate-x-full opacity-0"
              enterTo="translate-x-0 opacity-100"
              leave="transition ease-in-out duration-500 transform"
              leaveFrom="translate-x-0 opacity-100"
              leaveTo="-translate-x-full opacity-0"
            >
              <div className="relative w-screen max-w-md pointer-events-auto bg-white text-gray-900 flex flex-col overflow-y-auto">
                <div className="flex items-center justify-between w-full border-b border-gray-200 py-4 px-6">
                  <div className="flex-1 basis-0">
                    <ReactCountryFlag countryCode="dk" svg className="mb-1" />
                  </div>
                  <div>
                    <h1 className="text-large-semi">ACME</h1>
                  </div>
                  <div className="flex-1 basis-0 flex justify-end">
                    <button onClick={onClose}>
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-6 flex-1 flex flex-col justify-between p-6">
                  <div className="flex flex-col flex-1 text-large-semi text-gray-900 uppercase">
                    <div className="flex flex-col gap-y-1">
                      <Link href="/shop">
                        <a>Shop</a>
                      </Link>
                      {collections ? (
                        <Disclosure>
                          {({ open }) => {
                            return (
                              <>
                                <Disclosure.Button className="text-large-semi text-gray-900 uppercase flex items-center justify-between">
                                  <span>Collections</span>
                                  <ChevronDown size={20} />
                                </Disclosure.Button>
                                <Disclosure.Panel className="text-small-regular pl-4">
                                  <ul>
                                    {collections.map((collection) => (
                                      <li key={collection.id}>
                                        <Link
                                          href={`/collections/${collection.id}`}
                                        >
                                          <a>{collection.title}</a>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </Disclosure.Panel>
                              </>
                            )
                          }}
                        </Disclosure>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex flex-col gap-y-1 text-small-regular text-gray-700 uppercase">
                      {!customer || retrievingCustomer ? (
                        <Link href={`/account/login`} passHref>
                          <a>Login / Sign up</a>
                        </Link>
                      ) : (
                        <Link href={`/account`} passHref>
                          <a>My Account</a>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default MobileMenu
