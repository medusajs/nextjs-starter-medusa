import { Dialog } from "@headlessui/react"
import { useAccount } from "@lib/context/account-context"
import ChevronDown from "@modules/common/icons/chevron-down"
import Search from "@modules/common/icons/search"
import X from "@modules/common/icons/x"
import { useCollections } from "medusa-react"
import Link from "next/link"
import React from "react"
import ReactCountryFlag from "react-country-flag"

type MobileMenuProps = {
  open: boolean
  onClose: () => void
}

const MobileMenu: React.FC<MobileMenuProps> = ({ open, onClose }) => {
  const { customer, retrievingCustomer } = useAccount()
  const { collections } = useCollections()
  return (
    <Dialog
      as="div"
      className="fixed inset-0 flex z-50"
      open={open}
      onClose={onClose}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none fixed inset-y-0 right-left flex max-w-full">
          <div className="relative w-screen pointer-events-auto bg-white text-gray-900 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between w-full border-b border-gray-200 py-4 px-6">
              <div className="flex-1 basis-0">
                <button className="flex items-center gap-x-2">
                  <ReactCountryFlag countryCode="dk" svg />
                  <ChevronDown />
                </button>
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
              {process.env.FEATURE_SEARCH_ENABLED && (
                <div className="bg-gray-50 flex items-center p-4 gap-x-2 text-gray-500">
                  <Search size={24} />
                  <span
                    placeholder="Search products"
                    className="text-base-regular"
                  >
                    Search products
                  </span>
                </div>
              )}

              <div className="flex flex-col flex-1 text-large-regular text-gray-900">
                <ul className="flex flex-col gap-y-2">
                  <li className="bg-gray-50 p-4">
                    <Link href="/shop">
                      <a className="flex items-center justify-between">
                        <span>Shop</span>
                        <ChevronDown className="-rotate-90" />
                      </a>
                    </Link>
                  </li>
                  {collections ? (
                    <>
                      {collections.map((collection) => (
                        <li key={collection.id} className="bg-gray-50 p-4">
                          <Link href={`/collections/${collection.id}`}>
                            <a className="flex items-center justify-between">
                              <span>{collection.title}</span>
                              <ChevronDown className="-rotate-90" />
                            </a>
                          </Link>
                        </li>
                      ))}
                    </>
                  ) : null}
                </ul>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-col gap-y-8 text-small-regular">
                  {!customer || retrievingCustomer ? (
                    <div className="flex flex-col gap-y-4">
                      <span className="text-gray-700 uppercase">Account</span>
                      <Link href={`/account/login`} passHref>
                        <a className="flex items-center justify-between border-b border-gray-200 py-2">
                          <span className="normal-case">Sign in</span>
                          <ChevronDown className="-rotate-90" />
                        </a>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-y-4">
                      <span className="text-gray-700 uppercase">
                        Signed in as
                      </span>
                      <Link href={`/account`} passHref>
                        <a className="flex items-center justify-between border-b border-gray-200 py-2">
                          <span className="normal-case">{customer.email}</span>
                          <ChevronDown className="-rotate-90" />
                        </a>
                      </Link>
                    </div>
                  )}
                  <div className="flex flex-col gap-y-4">
                    <span className="text-gray-700 uppercase">Delivery</span>
                    <button className="flex items-center justify-between border-b border-gray-200 py-2">
                      <div className="flex items-center gap-x-2">
                        <ReactCountryFlag countryCode="dk" svg />
                        <span className="normal-case">Shipping to Denmark</span>
                      </div>
                      <ChevronDown className="-rotate-90" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default MobileMenu
