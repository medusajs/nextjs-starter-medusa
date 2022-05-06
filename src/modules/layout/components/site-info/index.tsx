import { Disclosure, Transition } from "@headlessui/react"
import Plus from "@modules/common/icons/plus"
import Link from "next/link"
import React from "react"

const Info = {
  about:
    "Medusa aims to lower the bar for when developers and merchants can start building headless. For many years, the headless approach to commerce has been an enterprise exclusivity due to the large number of resources that it required. Not anymore. Create a headless commerce store in minutes and start your growth journey on a fast and flexible foundation.",
  address: {
    city: "Medusa Town",
    country: "Denmark",
    zip: "1200",
    address_1: "Perseus Avenue 1",
  },
  links: [
    {
      label: "Contact",
      url: "/contact",
    },
    {
      label: "Returns & Exchanges",
      url: "/returns-and-exchanges",
    },
  ],
  socials: [
    {
      label: "GitHub",
      url: "https://www.github.com/medusajs",
    },
    {
      label: "Twitter",
      url: "https://twitter.com/medusajs",
    },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/company/medusajs",
    },
  ],
}

const SiteInfo: React.FC = () => {
  return (
    <div className="lg:flex lg:items-start lg:pb-6 lg:pt-12 pt-4 text-gray-700">
      <div className="lg:flex-1">
        <InfoContainer label="About">
          <p className="text-small-regular lg:max-w-[440px]">{Info.about}</p>
        </InfoContainer>
      </div>
      <div className="lg:mr-10">
        <InfoContainer label="Address">
          <p className="text-small-regular">
            {Info.address.address_1},<br />
            {Info.address.zip} {Info.address.city},<br />
            {Info.address.country}
          </p>
        </InfoContainer>
      </div>
      <div className="lg:mr-10">
        <InfoContainer label="Info">
          <ul className="text-small-regular flex flex-col gap-y-2">
            {Info.links.map((link) => {
              return (
                <li key={link.label}>
                  <Link href={link.url}>
                    <a>{link.label}</a>
                  </Link>
                </li>
              )
            })}
          </ul>
        </InfoContainer>
      </div>
      <div>
        <InfoContainer label="Follow us">
          <ul className="text-small-regular flex flex-col gap-y-2">
            {Info.socials.map((social) => {
              return (
                <li key={social.label}>
                  <Link href={social.url}>
                    <a>{social.label}</a>
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
        <span className="text-base-semi">{label}</span>
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
        <Disclosure.Button className="text-gray-900 flex items-center justify-between w-full">
          <span className="text-base-semi">{label}</span>
          <Plus size={16} />
        </Disclosure.Button>
        <Transition
          enter="duration-300 ease-in"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-300 ease-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Disclosure.Panel className="pt-2 pb-4 pr-4">
            {children}
          </Disclosure.Panel>
        </Transition>
      </Disclosure>
    </div>
  )
}

export default SiteInfo
