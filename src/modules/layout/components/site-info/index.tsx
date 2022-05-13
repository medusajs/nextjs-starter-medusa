import { Disclosure } from "@headlessui/react"
import Plus from "@modules/common/icons/plus"
import clsx from "clsx"
import Link from "next/link"
import React from "react"
import StoreConfig from "../../../../../store.config.json"

const SiteInfo: React.FC = () => {
  return (
    <div className="lg:flex lg:items-start lg:pb-6 lg:pt-12 pt-4 text-gray-700">
      <div className="lg:flex-1">
        <InfoContainer label="About">
          <p className="text-small-regular lg:max-w-[440px]">
            {StoreConfig.store.about}
          </p>
        </InfoContainer>
      </div>
      <div className="lg:mr-10">
        <InfoContainer label="Address">
          <p className="text-small-regular">
            {StoreConfig.store.address.address_line},<br />
            {StoreConfig.store.address.postal_code}{" "}
            {StoreConfig.store.address.city},<br />
            {StoreConfig.store.address.country}
          </p>
        </InfoContainer>
      </div>
      <div>
        <InfoContainer label="Follow us">
          <ul className="text-small-regular flex flex-col gap-y-2">
            {Object.entries(StoreConfig.store.socials).map(([key, value]) => {
              return (
                <li key={key}>
                  <Link href={value}>
                    <a>{key}</a>
                  </Link>
                </li>
              )
            })}
          </ul>
        </InfoContainer>
      </div>
    </div>
  )
}

const InfoContainer: React.FC<{ label: string }> = ({ label, children }) => {
  return (
    <div>
      <div className="hidden lg:flex lg:flex-col lg:gap-y-2">
        <span className="text-small-semi">{label}</span>
        {children}
      </div>
      <div className="lg:hidden mb-3">
        <Collapsible label={label}>{children}</Collapsible>
      </div>
    </div>
  )
}

const Collapsible: React.FC<{ label: string }> = ({ label, children }) => {
  return (
    <div className="border-b border-gray-200 pb-2">
      <Disclosure>
        {({ open }) => {
          return (
            <>
              <Disclosure.Button className="text-gray-900 flex items-center justify-between w-full">
                <span className="text-small-semi">{label}</span>
                <Plus size={16} />
              </Disclosure.Button>
              <Disclosure.Panel
                static
                className={clsx(
                  "transition-[max-height,opacity] duration-700 ease-in-out overflow-hidden",
                  {
                    "max-h-[300px] opacity-100": open,
                    "max-h-0 opacity-0": !open,
                  }
                )}
              >
                <div className="py-4">
                  <span>{children}</span>
                </div>
              </Disclosure.Panel>
            </>
          )
        }}
      </Disclosure>
    </div>
  )
}

export default SiteInfo
